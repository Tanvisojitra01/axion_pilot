import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load .env
load_dotenv()

database_url = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")
if not database_url:
    print("ERROR: DATABASE_URL not set in .env")
    exit(1)

print(f"Connecting to database at {database_url}...")
engine = create_engine(database_url)

with engine.connect() as conn:
    print("Checking/Adding missing columns to 'projects' table...")
    
    # Updated to match current app/models/project.py
    columns_to_add = [
        ("title", "VARCHAR"),
        ("domain", "VARCHAR"),
        ("difficulty", "VARCHAR"),
        ("tech_stack", "VARCHAR"),
        ("status", "VARCHAR DEFAULT 'active'"),
        ("created_at", "DATETIME")
    ]
    
    for col_name, col_type in columns_to_add:
        try:
            # Check if column exists first to avoid error spam
            print(f"Ensuring column '{col_name}'...")
            conn.execute(text(f"ALTER TABLE projects ADD COLUMN {col_name} {col_type}"))
            conn.commit()
            print(f"  DONE: Added {col_name}.")
        except Exception as e:
            err = str(e).lower()
            if "already exists" in err or "duplicate column" in err:
                print(f"  OK: Column '{col_name}' already exists.")
            else:
                print(f"  ERROR: Could not add '{col_name}': {e}")
    
    conn.commit()
    print("\nDONE: Schema sync complete.")
