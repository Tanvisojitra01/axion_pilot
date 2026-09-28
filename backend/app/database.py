import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use DATABASE_URL from environment if set; fall back to local SQLite for dev.
# To use PostgreSQL in production, set:
#   DATABASE_URL=postgresql://user:password@host:5432/dbname
_database_url = os.environ.get("DATABASE_URL", "").strip()
if "YOUR_SUPABASE_PASSWORD" in _database_url or "YOUR_PROJECT_REF" in _database_url or _database_url.startswith("http://") or _database_url.startswith("https://"):
    _database_url = ""

if _database_url.startswith("postgres://"):
    _database_url = _database_url.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = _database_url if _database_url else "sqlite:///./sql_app.db"

_is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")

if _is_sqlite:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    # PostgreSQL / other: use a proper connection pool
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # drop stale connections automatically
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
