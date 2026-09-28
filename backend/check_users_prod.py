from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
import os
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as c:
    # Try simple user count
    count = c.execute(text("SELECT COUNT(*) FROM users")).scalar()
    print(f"User count: {count}")
    
    if count > 0:
        rows = c.execute(text("SELECT id, email, is_active, is_admin FROM users")).fetchall()
        for r in rows:
            print(f"  id={r[0]}, email={r[1]}, active={r[2]}, admin={r[3]}")
    else:
        # Maybe users are in a different schema?
        schemas = c.execute(text("SELECT DISTINCT table_schema FROM information_schema.tables WHERE table_name='users'")).fetchall()
        print(f"'users' found in schemas: {[s[0] for s in schemas]}")
