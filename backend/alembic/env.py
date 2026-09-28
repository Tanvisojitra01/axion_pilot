from logging.config import fileConfig
import os
import sys
from dotenv import load_dotenv

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Add project root to path so we can import app modules
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
load_dotenv()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- Models Integration ---
from app.database import Base
from app.models.user import User, LoginVerification, ForgotPasswordVerification
from app.models.project import Project
from app.models.activity import Activity
from app.models.settings import PlatformSettings, ProjectTemplate

target_metadata = Base.metadata

def get_url():
    """Returns DATABASE_URL from .env or defaults to a local path (unlikely to be used here)"""
    return os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Build engine configuration
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
