"""
Full database diagnostic script.
Run: python diagnose_db.py
"""
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")

import os
from sqlalchemy import create_engine, text, inspect

db_url = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")
print(f"DB URL (first 40 chars): {db_url[:40]}")

engine = create_engine(db_url)

with engine.connect() as conn:
    # List tables
    result = conn.execute(text("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    """))
    tables = [row[0] for row in result.fetchall()]
    print(f"\nAll tables: {tables}")
    
    # Check users
    if "users" in tables:
        result = conn.execute(text("SELECT id, email, is_active, is_admin FROM users"))
        users = result.fetchall()
        print(f"\nUsers ({len(users)}):")
        for u in users:
            print(f"  id={u[0]}, email={u[1]}, active={u[2]}, admin={u[3]}")
    else:
        print("\n❌ users table NOT FOUND!")
    
    # Check forgot_password_verifications
    if "forgot_password_verifications" in tables:
        result = conn.execute(text("SELECT id, user_id, expires_at FROM forgot_password_verifications"))
        rows = result.fetchall()
        print(f"\nforgot_password_verifications ({len(rows)} rows): {rows}")
    else:
        print("\n❌ forgot_password_verifications table NOT FOUND!")
        print("  Run: python ensure_tables.py to create it.")
