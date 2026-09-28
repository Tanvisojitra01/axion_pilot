from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.auth.jwt_handler import verify_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Validate current user. Includes real-time revocation via token_version check."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token, credentials_exception)
    email = payload.get("sub")
    
    user = db.query(User).filter(User.email == email).first()
    
    # [Revocation Check] Is user active? Is the JWT version current?
    # This renders all old tokens void if password/token_version is reset in DB.
    if user is None or not user.is_active:
        raise credentials_exception
        
    if payload.get("v") != user.token_version:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired due to a security update. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)) -> Optional[User]:
    """Optional user validation. Does not throw if user is not logged in."""
    if not token:
        return None
    try:
        # Reuse get_current_user logic for validation
        return get_current_user(token, db)
    except Exception:
        # Invalid or expired token, but we allow it for public features
        return None
