from sqlalchemy import create_engine, inspect
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def check_schema():
    url = os.environ.get("DATABASE_URL")
    engine = create_engine(url)
    inspector = inspect(engine)
    
    print(f"Table name: users")
    columns = inspector.get_columns("users")
    for c in columns:
        print(f"  Column: {c['name']} ({c['type']})")

if __name__ == "__main__":
    check_schema()
