from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    role = Column(String, default="user") # admin, user, moderator
    plan = Column(String, default="free")
    mobile = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # [Security] Session revocation version. Default 1. Incremented on password change.
    token_version = Column(Integer, server_default="1", default=1, nullable=False)

    projects = relationship("Project", back_populates="owner")
    passkeys = relationship("PassKey", back_populates="user", cascade="all, delete-orphan")


# ── Temporary verification storage (Hashed OTPs only) ──────────────────────────

class SignupVerification(Base):
    __tablename__ = "signup_verifications"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    mobile = Column(String)
    name = Column(String)
    hashed_password = Column(String)
    email_otp_hash = Column(String)
    mobile_otp_hash = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    attempt_count = Column(Integer, default=0)

class LoginVerification(Base):
    __tablename__ = "login_verifications"
    id = Column(Integer, primary_key=True, index=True)
    # CASCADE: when a user is deleted, their pending login OTPs are also deleted
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    otp_hash = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    attempt_count = Column(Integer, default=0)

class ForgotPasswordVerification(Base):
    __tablename__ = "forgot_password_verifications"
    id = Column(Integer, primary_key=True, index=True)
    # CASCADE: when a user is deleted, their pending reset OTPs are also deleted
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    otp_hash = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    attempt_count = Column(Integer, default=0)
