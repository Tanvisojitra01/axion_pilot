from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from datetime import datetime
from app.database import Base

class Activity(Base):
    __tablename__ = "platform_activity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action_type = Column(String) # "PROJECT_GEN", "REPORT_GEN", "PPT_GEN", "USER_REG"
    description = Column(String)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
