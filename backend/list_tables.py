from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
import os
from sqlalchemy import create_engine, text

db = os.environ.get("DATABASE_URL")
print(f"DB: {db[:40]}")
engine = create_engine(db)
with engine.connect() as c:
    rows = c.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")).fetchall()
    print("TABLES:")
    for r in rows:
        print(f"  {r[0]}")
    
    # Count users
    count = c.execute(text("SELECT COUNT(*) FROM users")).scalar()
    print(f"\nUser count: {count}")
    
    if count > 0:
        users = c.execute(text("SELECT id, email, is_active FROM users")).fetchall()
        for u in users:
            print(f"  {u[0]}: {u[1]} (active={u[2]})")
