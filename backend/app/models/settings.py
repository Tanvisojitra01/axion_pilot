from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime
from datetime import datetime
from app.database import Base

class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(Integer, primary_key=True)
    setting_key = Column(String, unique=True, index=True) # e.g. "AI_CONFIG"
    setting_value = Column(JSON) # e.g. { "model": "...", "temperature": 0.7 }
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProjectTemplate(Base):
    __tablename__ = "project_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    domain = Column(String)
    difficulty = Column(String)
    tech_stack = Column(String)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
