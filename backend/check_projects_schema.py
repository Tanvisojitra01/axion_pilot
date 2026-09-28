import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get("DATABASE_URL", "")
if not database_url:
    database_url = "sqlite:///./sql_app.db"

engine = create_engine(database_url)
inspector = inspect(engine)

if "projects" in inspector.get_table_names():
    columns = [c["name"] for c in inspector.get_columns("projects")]
    print(f"Columns in 'projects': {columns}")
else:
    print("'projects' table not found.")
