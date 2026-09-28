from pydantic import BaseModel, EmailStr, constr, field_validator
from typing import Optional
from datetime import datetime
import re

# ── Base Auth ────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: constr(min_length=2, max_length=50)
    mobile: Optional[str] = None  # Mobile is now optional

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8: raise ValueError("8+ chars required")
        if not re.search(r"[A-Z]", v): raise ValueError("Uppercase required")
        if not re.search(r"[0-9]", v): raise ValueError("Digit required")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v): raise ValueError("Special char required")
        return v

# ── 2FA & Verification Flows ──────────────────────────────────────────────────

class SignupVerify(UserBase):
    email_otp: str  # Only email OTP needed now

class LoginPending(BaseModel):
    message: str
    requires_otp: bool = True

class LoginOTPVerify(UserBase):
    otp: str

# ── Forgot Password ───────────────────────────────────────────────────────────

class ForgotPasswordRequest(UserBase):
    pass

class ForgotPasswordReset(UserBase):
    otp: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8: raise ValueError("8+ chars required")
        if not re.search(r"[A-Z]", v): raise ValueError("Uppercase required")
        if not re.search(r"[0-9]", v): raise ValueError("Digit required")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v): raise ValueError("Special char required")
        return v

# ── System Responses ──────────────────────────────────────────────────────────

class UserResponse(UserBase):
    id: int
    is_active: bool
    plan: str
    is_admin: bool
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None
    name: Optional[str] = None
    mobile: Optional[str] = None
    token_version: int

    class Config:
        from_attributes = True

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    
    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8: raise ValueError("8+ chars required")
        if not re.search(r"[A-Z]", v): raise ValueError("Uppercase required")
        if not re.search(r"[0-9]", v): raise ValueError("Digit required")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v): raise ValueError("Special char required")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    v: Optional[int] = 1  # token version
