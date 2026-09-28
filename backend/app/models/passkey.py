from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, LargeBinary, Text
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class PassKey(Base):
    __tablename__ = "passkeys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    credential_id = Column(String, unique=True, index=True)  # WebAuthn credential ID
    public_key = Column(Text)  # Stored as JSON string for COSE key
    sign_count = Column(Integer, default=0)  # Counter for cloned credential detection
    transports = Column(String, nullable=True)  # e.g., "usb,bluetooth,nfc" (JSON serialized)
    nickname = Column(String, nullable=True)  # User-friendly name (e.g., "My Yubikey")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="passkeys")

class PasskeyChallenge(Base):
    """Temporary storage for WebAuthn challenges during registration/authentication"""
    __tablename__ = "passkey_challenges"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    challenge = Column(String)  # Base64-encoded challenge
    challenge_type = Column(String)  # "registration" or "authentication"
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
