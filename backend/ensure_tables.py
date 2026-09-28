"""
Run this script to ensure all required tables exist in the production database.
Usage: python ensure_tables.py
"""
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")

import os
from sqlalchemy import create_engine, text, inspect

database_url = os.environ.get("DATABASE_URL", "")
if not database_url:
    database_url = "sqlite:///./sql_app.db"

print(f"Connecting to database...")

engine = create_engine(database_url)

# Import all models so SQLAlchemy knows about them
from app.database import Base
from app.models.user import User, SignupVerification, LoginVerification, ForgotPasswordVerification
from app.models.project import Project
from app.models.activity import Activity

# Create all tables that don't exist yet (safe — won't drop existing tables)
print("Creating missing tables if any...")
Base.metadata.create_all(bind=engine)

# Verify
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"\n✅ Tables in database: {tables}")

# Check specifically for forgot_password_verifications
if "forgot_password_verifications" in tables:
    print("✅ forgot_password_verifications table EXISTS")
else:
    print("❌ forgot_password_verifications table MISSING — something went wrong!")

# Test: check users
with engine.connect() as conn:
    result = conn.execute(text("SELECT email, is_active FROM users"))
    users = result.fetchall()
    print(f"\nUsers ({len(users)} total):")
    for u in users:
        print(f"  - {u.email} (active: {u.is_active})")
