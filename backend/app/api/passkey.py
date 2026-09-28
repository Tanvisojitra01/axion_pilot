import json
import logging
import base64
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.auth.passkey_handler import (
    generate_passkey_registration_options,
    verify_passkey_registration,
    generate_passkey_authentication_options,
    verify_passkey_authentication,
    generate_challenge,
)
from app.auth.dependencies import get_current_user
from app.auth.jwt_handler import create_access_token
from app.database import get_db
from app.models.user import User
from app.models.passkey import PassKey, PasskeyChallenge
from app.schemas.passkey import (
    PassKeyRegistrationStart,
    PassKeyRegistrationStartResponse,
    PassKeyRegistrationComplete,
    PassKeyAuthenticationStart,
    PassKeyAuthenticationStartResponse,
    PassKeyAuthentication,
    PassKeyResponse,
    PassKeyListResponse,
)
from app.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()

CHALLENGE_EXPIRY_MINUTES = 15


def _normalize_email(email: str) -> str:
    """Normalize email to lowercase."""
    return email.strip().lower()


# ── Passkey Registration ──────────────────────────────────────────────────────

@router.post("/passkey/register/start", response_model=PassKeyRegistrationStartResponse)
@limiter.limit("5/minute")
def passkey_register_start(
    request: Request,
    data: PassKeyRegistrationStart,
    db: Session = Depends(get_db),
):
    """Start passkey registration — returns WebAuthn options and challenge."""
    email = _normalize_email(data.email)
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please sign up first.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive.",
        )

    # Generate challenge and registration options
    challenge = generate_challenge()
    options = generate_passkey_registration_options(email, data.name or user.name)
    
    # Store challenge temporarily
    existing = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.email == email,
        PasskeyChallenge.challenge_type == "registration",
    ).first()
    
    if existing:
        db.delete(existing)
    
    expires_at = datetime.utcnow() + timedelta(minutes=CHALLENGE_EXPIRY_MINUTES)
    db.add(PasskeyChallenge(
        email=email,
        challenge=challenge,
        challenge_type="registration",
        expires_at=expires_at,
    ))
    db.commit()
    
    logger.info(f"[PASSKEY] Registration started for {email}")
    return PassKeyRegistrationStartResponse(
        options=json.loads(options),
        challenge=challenge,
    )


@router.post("/passkey/register/complete", response_model=PassKeyResponse)
@limiter.limit("5/minute")
def passkey_register_complete(
    request: Request,
    data: PassKeyRegistrationComplete,
    db: Session = Depends(get_db),
):
    """Complete passkey registration — verify credential and store."""
    email = _normalize_email(data.email)
    
    # Fetch user
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user.",
        )

    # Verify challenge exists and is valid
    challenge_record = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.email == email,
        PasskeyChallenge.challenge_type == "registration",
    ).first()
    
    if not challenge_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration challenge not found. Start registration again.",
        )
    
    if datetime.utcnow() > challenge_record.expires_at:
        db.delete(challenge_record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Challenge expired. Start registration again.",
        )

    if challenge_record.challenge != data.challenge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid challenge.",
        )

    # Verify credential
    try:
        verified = verify_passkey_registration(
            email=email,
            credential=data.credential,
            challenge=data.challenge,
        )
    except Exception as e:
        logger.error(f"[PASSKEY] Registration verification failed for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credential verification failed.",
        )

    # Store passkey
    passkey = PassKey(
        user_id=user.id,
        credential_id=verified["credential_id"],
        public_key=verified["public_key"],
        sign_count=verified["sign_count"],
        nickname=data.nickname or f"Passkey {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        is_active=True,
    )
    
    db.add(passkey)
    db.delete(challenge_record)
    db.commit()
    
    logger.info(f"[PASSKEY] Registration completed for {email}")
    
    return PassKeyResponse(
        id=passkey.id,
        nickname=passkey.nickname,
        created_at=passkey.created_at,
        last_used_at=passkey.last_used_at,
        is_active=passkey.is_active,
    )


# ── Passkey Authentication ────────────────────────────────────────────────────

@router.post("/passkey/login/start", response_model=PassKeyAuthenticationStartResponse)
@limiter.limit("5/minute")
def passkey_login_start(
    request: Request,
    data: PassKeyAuthenticationStart,
    db: Session = Depends(get_db),
):
    """Start passkey authentication — returns WebAuthn options and challenge."""
    email = _normalize_email(data.email)
    
    # Check if user exists and has passkeys
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        # Generic response to prevent user enumeration
        logger.warning(f"[PASSKEY] Login attempted for non-existent user: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account is inactive.",
        )
    
    passkey = db.query(PassKey).filter(
        PassKey.user_id == user.id,
        PassKey.is_active == True,
    ).first()
    
    if not passkey:
        logger.warning(f"[PASSKEY] No active passkeys for user: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No passkeys registered for this account.",
        )

    # Generate challenge
    challenge = generate_challenge()
    options = generate_passkey_authentication_options(email)
    
    # Store challenge temporarily
    existing = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.email == email,
        PasskeyChallenge.challenge_type == "authentication",
    ).first()
    
    if existing:
        db.delete(existing)
    
    expires_at = datetime.utcnow() + timedelta(minutes=CHALLENGE_EXPIRY_MINUTES)
    db.add(PasskeyChallenge(
        email=email,
        challenge=challenge,
        challenge_type="authentication",
        expires_at=expires_at,
    ))
    db.commit()
    
    logger.info(f"[PASSKEY] Login challenge generated for {email}")
    return PassKeyAuthenticationStartResponse(
        options=json.loads(options),
        challenge=challenge,
    )


@router.post("/passkey/login/complete")
@limiter.limit("5/minute")
def passkey_login_complete(
    request: Request,
    data: PassKeyAuthentication,
    db: Session = Depends(get_db),
):
    """Complete passkey authentication — verify assertion and issue JWT."""
    email = _normalize_email(data.email)
    
    # Fetch user
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )

    # Verify challenge exists
    challenge_record = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.email == email,
        PasskeyChallenge.challenge_type == "authentication",
    ).first()
    
    if not challenge_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication challenge not found. Start login again.",
        )
    
    if datetime.utcnow() > challenge_record.expires_at:
        db.delete(challenge_record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Challenge expired. Start login again.",
        )

    if challenge_record.challenge != data.challenge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid challenge.",
        )

    # Find matching passkey (by credential ID from the assertion)
    try:
        # Extract credential ID from the assertion response
        credential_id_b64 = data.credential.get("id")
        if not credential_id_b64:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credential.",
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credential format.",
        )

    passkey = db.query(PassKey).filter(
        PassKey.user_id == user.id,
        PassKey.credential_id == credential_id_b64,
        PassKey.is_active == True,
    ).first()
    
    if not passkey:
        logger.warning(f"[PASSKEY] Credential not found for user {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credential not registered.",
        )

    # Verify assertion
    try:
        verified = verify_passkey_authentication(
            credential=data.credential,
            challenge=data.challenge,
            public_key_b64=passkey.public_key,
            sign_count=passkey.sign_count,
        )
    except Exception as e:
        logger.error(f"[PASSKEY] Authentication verification failed for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed.",
        )

    # Check for cloned authenticator (sign count went backwards)
    if not verified["sign_count_valid"]:
        logger.error(f"[PASSKEY] Possible cloned authenticator for {email}")
        passkey.is_active = False
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Security check failed. Passkey has been deactivated.",
        )

    # Update passkey sign count and last used time
    passkey.sign_count = verified["new_sign_count"]
    passkey.last_used_at = datetime.utcnow()
    db.commit()

    # Issue JWT token
    access_token = create_access_token(data={"sub": user.email, "v": user.token_version})
    logger.info(f"[PASSKEY] Successful login for {email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
    }


# ── Passkey Management ────────────────────────────────────────────────────────

@router.get("/passkey/list", response_model=PassKeyListResponse)
def list_passkeys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all passkeys for the current user."""
    passkeys = db.query(PassKey).filter(PassKey.user_id == current_user.id).all()
    
    return PassKeyListResponse(
        passkeys=[
            PassKeyResponse(
                id=pk.id,
                nickname=pk.nickname,
                created_at=pk.created_at,
                last_used_at=pk.last_used_at,
                is_active=pk.is_active,
            )
            for pk in passkeys
        ]
    )


@router.delete("/passkey/{passkey_id}")
def delete_passkey(
    passkey_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a passkey (user can only delete their own)."""
    passkey = db.query(PassKey).filter(
        PassKey.id == passkey_id,
        PassKey.user_id == current_user.id,
    ).first()
    
    if not passkey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passkey not found.",
        )
    
    db.delete(passkey)
    db.commit()
    
    logger.info(f"[PASSKEY] Passkey {passkey_id} deleted for user {current_user.email}")
    return {"message": "Passkey deleted successfully."}
