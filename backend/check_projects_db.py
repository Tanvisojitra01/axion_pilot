from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
import os
from sqlalchemy import create_engine, text

db = os.environ.get("DATABASE_URL")
engine = create_engine(db)
with engine.connect() as c:
    try:
        rows = c.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects'")).fetchall()
        print("PROJECTS COLUMNS:")
        for r in rows:
            print(f"  {r[0]} ({r[1]})")
            
        count = c.execute(text("SELECT COUNT(*) FROM projects")).scalar()
        print(f"\nProjects count: {count}")
    except Exception as e:
        print(e)
