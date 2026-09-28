import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv
from pathlib import Path

# Load .env
load_dotenv(Path(__file__).resolve().parent / "backend" / ".env")

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    db_url = "sqlite:///./backend/sql_app.db"

print(f"Connecting to: {db_url}")

try:
    engine = create_engine(db_url)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("\nTables found:")
    for table in tables:
        print(f"  - {table}")
        columns = inspector.get_columns(table)
        for col in columns:
            print(f"    • {col['name']} ({col['type']})")
except Exception as e:
    print(f"Error: {e}")
