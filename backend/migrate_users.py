"""
Migration Script: Copies users from local SQLite to the remote Postgres database.
Usage: python migrate_users.py
"""
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load env to get DATABASE_URL
load_dotenv(Path(__file__).resolve().parent / ".env")

def migrate():
    sqlite_path = "sql_app.db"
    pg_url = os.environ.get("DATABASE_URL")
    super_admin = os.environ.get("SUPER_ADMIN_EMAIL", "admin@example.com").lower()

    if not os.path.exists(sqlite_path):
        print(f"❌ SQLite file '{sqlite_path}' not found at current location.")
        return

    if not pg_url or "postgresql" not in pg_url:
        print("❌ DATABASE_URL is not set to a Postgres instance.")
        return

    print(f"Connecting to SQLite: {sqlite_path}")
    sq_conn = sqlite3.connect(sqlite_path)
    sq_cursor = sq_conn.cursor()
    
    try:
        # Get all users from SQLite
        sq_cursor.execute("SELECT name, email, hashed_password, is_active, is_admin, plan, mobile, created_at FROM users")
        sq_users = sq_cursor.fetchall()
        print(f"Found {len(sq_users)} users in local SQLite.")
    except Exception as e:
        print(f"❌ Could not read users from SQLite: {e}")
        return

    print(f"Connecting to Postgres: {pg_url[:50]}...")
    pg_engine = create_engine(pg_url)
    
    with pg_engine.connect() as pg_conn:
        for u in sq_users:
            name, email, hashed_pw, active, admin, plan, mobile, created_at = u
            email = email.lower()
            
            # Check if user already exists in Postgres
            exists = pg_conn.execute(text("SELECT id FROM users WHERE email = :e"), {"e": email}).fetchone()
            if exists:
                print(f"  [SKIP] {email} already exists in Postgres.")
                continue

            # Override admin status if it's the super admin
            final_admin = admin or (email == super_admin)
            
            print(f"  [MIGRATING] {email} (is_admin={final_admin})...")
            pg_conn.execute(text("""
                INSERT INTO users (name, email, hashed_password, is_active, is_admin, plan, mobile, created_at, token_version)
                VALUES (:name, :email, :hashed_password, :active, :admin, :plan, :mobile, :created_at, 1)
            """), {
                "name": name, "email": email, "hashed_password": hashed_pw,
                "active": bool(active), "admin": bool(final_admin), "plan": plan,
                "mobile": mobile, "created_at": created_at
            })
        
        pg_conn.commit()
    
    print("\n✅ Migration complete!")

if __name__ == "__main__":
    migrate()
