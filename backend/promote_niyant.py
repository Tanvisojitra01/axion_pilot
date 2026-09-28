import os
from sqlalchemy import create_engine, text
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def promote_admin():
    url = os.environ.get("DATABASE_URL")
    email = "admin@example.com"
    engine = create_engine(url)
    with engine.connect() as conn:
        print(f"Promoting {email} to Admin...")
        conn.execute(text("UPDATE users SET is_admin = True WHERE email = :e"), {"e": email})
        conn.commit()
        print("Done!")

if __name__ == "__main__":
    promote_admin()
