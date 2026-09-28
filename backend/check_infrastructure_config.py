import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(DATABASE_URL)

def check():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT setting_key, setting_value FROM platform_settings WHERE setting_key = 'EMAIL_CONFIG'")).fetchone()
            if result:
                print(f"FOUND: {result[0]} -> {result[1]}")
            else:
                print("NOT FOUND")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check()
