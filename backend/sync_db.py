import os
from sqlalchemy import create_engine, text, inspect
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def sync_db():
    url = os.environ.get("DATABASE_URL")
    if not url:
        url = "sqlite:///./sql_app.db"
        
    print(f"Syncing DB at {url[:30]}...")
    engine = create_engine(url)
    
    # Import models for metadata
    from app.database import Base
    from app.models.user import User
    from app.models.project import Project, ProjectContent
    from app.models.activity import Activity
    
    # 1. Create tables if missing (safe)
    print("Creating missing tables...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Add individual columns to 'projects' because they might exist but be missing columns
    print("Checking 'projects' columns...")
    with engine.connect() as conn:
        inspector = inspect(engine)
        existing_cols = [c["name"] for c in inspector.get_columns("projects")]
        
        target_cols = [
            ("title", "VARCHAR"),
            ("domain", "VARCHAR"),
            ("difficulty", "VARCHAR"),
            ("tech_stack", "VARCHAR"),
            ("data", "JSONB" if "postgresql" in url else "JSON"),
            ("status", "VARCHAR DEFAULT 'active'")
        ]
        
        for name, type_ in target_cols:
            if name not in existing_cols:
                print(f"  Adding column '{name}' to 'projects'...")
                try:
                    conn.execute(text(f"ALTER TABLE projects ADD COLUMN {name} {type_}"))
                except Exception as e:
                    print(f"  ERROR adding '{name}': {e}")
            else:
                print(f"  Column '{name}' exists.")
        
        conn.commit()
    print("DONE! Database synced.")

if __name__ == "__main__":
    sync_db()
