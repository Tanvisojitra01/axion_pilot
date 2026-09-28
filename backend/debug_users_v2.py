from sqlalchemy import create_engine, text, inspect
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv(Path(__file__).resolve().parent / ".env")

database_url = os.environ.get("DATABASE_URL")
if not database_url:
    database_url = "sqlite:///./sql_app.db"

print(f"Connecting to: {database_url}")

try:
    engine = create_engine(database_url)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nTables in database: {tables}")
    
    if "users" in tables:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT email, is_active, is_admin FROM users"))
            users = result.fetchall()
            print("\nUsers in database:")
            for user in users:
                print(f"- Email: {user.email}, Active: {user.is_active}, Admin: {user.is_admin}")
    else:
        print("\n'users' table NOT FOUND!")
except Exception as e:
    print(f"Error: {e}")
