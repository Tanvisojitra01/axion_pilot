from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime


class PassKeyRegistrationStart(BaseModel):
    """Request to start passkey registration"""
    email: EmailStr
    name: Optional[str] = None


class PassKeyRegistrationStartResponse(BaseModel):
    """Response with registration options"""
    options: Any  # WebAuthn registration options as JSON
    challenge: str


class PassKeyRegistrationComplete(BaseModel):
    """Request to complete passkey registration"""
    email: EmailStr
    credential: Any  # WebAuthn credential response
    challenge: str
    nickname: Optional[str] = None


class PassKeyAuthenticationStart(BaseModel):
    """Request to start passkey authentication"""
    email: EmailStr


class PassKeyAuthenticationStartResponse(BaseModel):
    """Response with authentication options"""
    options: Any  # WebAuthn authentication options as JSON
    challenge: str


class PassKeyAuthentication(BaseModel):
    """Request to complete passkey authentication"""
    email: EmailStr
    credential: Any  # WebAuthn assertion response
    challenge: str


class PassKeyResponse(BaseModel):
    """Response model for a passkey"""
    id: int
    nickname: Optional[str]
    created_at: datetime
    last_used_at: Optional[datetime]
    is_active: bool


class PassKeyListResponse(BaseModel):
    """List of user's passkeys"""
    passkeys: list[PassKeyResponse]
