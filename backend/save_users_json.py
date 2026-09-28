import os
import json
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get("DATABASE_URL", "")
if not database_url:
    database_url = "sqlite:///./sql_app.db"

engine = create_engine(database_url)
inspector = inspect(engine)

schema = {}

for table in ["users", "signup_verifications"]:
    if table in inspector.get_table_names():
        columns = [c["name"] for c in inspector.get_columns(table)]
        schema[table] = columns
    else:
        schema[table] = "Table not found."

with open("users_schema.json", "w") as f:
    json.dump(schema, f)
