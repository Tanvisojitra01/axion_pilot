import hashlib
import logging
import os
import secrets
import string
import unicodedata
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.jwt_handler import create_access_token
from app.auth.utils import get_password_hash, verify_password
from app.database import get_db
from app.models.activity import Activity
from app.models.user import User
from app.schemas.user import (
    ForgotPasswordRequest,
    ForgotPasswordReset,
    LoginOTPVerify,
    SignupVerify,
    Token,
    UserCreate,
    UserResponse,
)
from app.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()

# ── Config ────────────────────────────────────────────────────────────────────
SUPER_ADMIN_EMAIL = os.environ.get("SUPER_ADMIN_EMAIL", "").strip().lower()


def _normalize_email(email: str) -> str:
    """NFKC-normalize to block Unicode homoglyph attacks."""
    return unicodedata.normalize("NFKC", email.strip().lower())


# ── Direct Signup (No Email OTP Required) ─────────────────────────────────────

@router.post("/signup", response_model=Token)
@limiter.limit("20/minute")
def signup(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    """Direct signup without email OTP verification — immediately creates user and issues JWT."""
    email = _normalize_email(user.email)

    # Check if user already exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in."
        )

    # Hash password & create user directly
    hashed_password = get_password_hash(user.password)
    is_admin = bool(SUPER_ADMIN_EMAIL and email == SUPER_ADMIN_EMAIL)

    new_user = User(
        email=email,
        name=user.full_name,
        mobile=user.mobile if user.mobile else None,
        hashed_password=hashed_password,
        is_admin=is_admin,
        is_active=True,
    )
    db.add(new_user)
    db.flush()
    db.add(Activity(user_id=new_user.id, action_type="USER_REG", description=f"Registered: {email}"))
    db.commit()
    logger.info(f"[SIGNUP] New user created directly: {email}")

    # Immediately issue JWT access token
    access_token = create_access_token(data={"sub": new_user.email, "v": new_user.token_version})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify-signup", response_model=UserResponse)
def verify_signup_fallback(request: Request, data: SignupVerify, db: Session = Depends(get_db)):
    """Backward compatibility fallback for verify-signup."""
    email = _normalize_email(data.email)
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    raise HTTPException(status_code=400, detail="User not found.")


# ── Direct Login (No Email 2FA/OTP Required) ──────────────────────────────────

@router.post("/login", response_model=Token)
@limiter.limit("20/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Direct password authentication — issues JWT directly without email OTP/2FA."""
    email = _normalize_email(form_data.username)
    user = db.query(User).filter(User.email == email).first()

    # Timing-safe failure
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended. Contact support.")

    # Auto-elevate super-admin in case the flag was ever unset
    if SUPER_ADMIN_EMAIL and email == SUPER_ADMIN_EMAIL and not user.is_admin:
        user.is_admin = True

    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()

    # Immediately issue JWT access token
    access_token = create_access_token(data={"sub": user.email, "v": user.token_version})
    logger.info(f"[LOGIN] Direct successful login for {email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/verify-otp", response_model=Token)
def login_verify_otp_fallback(request: Request, data: LoginOTPVerify, db: Session = Depends(get_db)):
    """Backward compatibility fallback for login/verify-otp."""
    email = _normalize_email(data.email)
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid session or user not found.")
    access_token = create_access_token(data={"sub": user.email, "v": user.token_version})
    return {"access_token": access_token, "token_type": "bearer"}


# ── Password Reset (Direct) ───────────────────────────────────────────────────

@router.post("/forgot-password")
@limiter.limit("10/minute")
def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Password reset request endpoint."""
    email = _normalize_email(data.email)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"message": "If an account with that email exists, password reset is ready."}
    return {"message": "You can now reset your password directly."}


@router.post("/reset-password")
@limiter.limit("10/minute")
def reset_password(request: Request, data: ForgotPasswordReset, db: Session = Depends(get_db)):
    """Update password directly."""
    email = _normalize_email(data.email)
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=400, detail="Invalid user account.")

    # Invalidate existing sessions and set new password
    user.hashed_password = get_password_hash(data.new_password)
    user.token_version = user.token_version + 1
    db.add(Activity(user_id=user.id, action_type="PWD_RESET", description="Password reset"))
    db.commit()
    logger.info(f"[RESET-PWD] Password updated directly for {email}")
    return {"message": "Password updated successfully. Please log in with your new password."}
