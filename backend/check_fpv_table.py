from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
import os
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as c:
    rows = c.execute(text(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    )).fetchall()
    print("TABLES IN PRODUCTION:")
    for r in rows:
        print(f"  {r[0]}")
    
    # Check for the specific table
    found = any(r[0] == "forgot_password_verifications" for r in rows)
    if found:
        print("\n✅ forgot_password_verifications EXISTS!")
    else:
        print("\n❌ forgot_password_verifications MISSING!")
