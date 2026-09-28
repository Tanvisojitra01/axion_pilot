import os
from sqlalchemy import create_engine, text
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def print_users():
    url = os.environ.get("DATABASE_URL")
    engine = create_engine(url)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, email, is_admin FROM users"))
        for row in result.fetchall():
            print(f"ID: {row[0]}, Email: {row[1]}, Admin: {row[2]}")

if __name__ == "__main__":
    print_users()
