from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserPasswordUpdate
from app.auth.dependencies import get_current_user
from app.auth.utils import verify_password, get_password_hash

router = APIRouter()

class ProfileUpdate(BaseModel):
    name: Optional[str] = None

@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's profile name."""
    if data.name is not None:
        name = data.name.strip()
        if len(name) < 2 or len(name) > 50:
            raise HTTPException(status_code=400, detail="Name must be 2-50 characters.")
        current_user.name = name
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def update_password(
    password_data: UserPasswordUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Securely update the user password and invalidate all other sessions."""
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = get_password_hash(password_data.new_password)
    
    # [Revocation] Increment session version. All old tokens will fail the v check.
    current_user.token_version += 1
    db.commit()
    return {"message": "Password updated. Other active sessions revoked."}

@router.post("/me/logout-all")
def logout_from_all_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invalidate all active sessions for the current user."""
    current_user.token_version += 1
    db.commit()
    return {"message": "Successfully logged out from all devices."}

@router.delete("/me")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Permanently delete the user account."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully."}
