from sqlalchemy import create_engine
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(DATABASE_URL)

def run_query(query):
    try:
        with engine.connect() as conn:
            from sqlalchemy import text
            result = conn.execute(text(query))
            return result.fetchall()
    except Exception as e:
        print(f"ERROR executing query: {e}")
        return []

def check():
    print("--- RECENT SIGNUP VERIFICATIONS (Top 5) ---")
    signups = run_query("SELECT id, email, created_at, expires_at FROM signup_verifications ORDER BY created_at DESC LIMIT 5")
    for s in signups:
        print(s)

    print("\n--- RECENT LOGIN VERIFICATIONS (Top 5) ---")
    logins = run_query("SELECT id, user_id, created_at, expires_at FROM login_verifications ORDER BY created_at DESC LIMIT 5")
    for l in logins:
        print(l)

    print("\n--- RECENT FORGOT PWD VERIFICATIONS ---")
    fp = run_query("SELECT id, user_id, created_at, expires_at FROM forgot_password_verifications ORDER BY created_at DESC LIMIT 5")
    for f in fp:
        print(f)

if __name__ == "__main__":
    check()
