import os
from sqlalchemy import create_engine, text
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")
url = os.environ.get("DATABASE_URL")
engine = create_engine(url)
with engine.connect() as c:
    rows = c.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'")).fetchall()
    cols = [r[0] for r in rows]
    print(f"TRUTH COLS: {cols}")
    
    rows = c.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).fetchall()
    tables = [r[0] for r in rows]
    print(f"TRUTH TABLES: {tables}")
