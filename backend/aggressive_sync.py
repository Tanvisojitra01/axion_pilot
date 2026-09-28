import os
from sqlalchemy import create_engine, text
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def sycn_pg():
    url = os.environ.get("DATABASE_URL")
    print(f"Finalizing Database Health on {url[:30]}...")
    engine = create_engine(url)
    
    with engine.connect() as conn:
        # ── CORE DASHBOARD TABLES ─────────────────────────────────────────────
        print("Ensuring 'platform_activity' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS platform_activity (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                action_type VARCHAR,
                description VARCHAR,
                extra_data JSONB,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
            )
        """))
        
        print("Ensuring 'platform_settings' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS platform_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR UNIQUE,
                setting_value JSONB,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
            )
        """))
        
        print("Ensuring 'project_templates' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS project_templates (
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                domain VARCHAR,
                difficulty VARCHAR,
                tech_stack VARCHAR,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
            )
        """))
        
        # ── PROJECT SCHEMA SYNC ───────────────────────────────────────────────
        cols = [
            ("title", "VARCHAR"),
            ("domain", "VARCHAR"),
            ("difficulty", "VARCHAR"),
            ("tech_stack", "VARCHAR"),
            ("data", "JSONB"),
            ("status", "VARCHAR DEFAULT 'active'")
        ]
        
        for name, type_ in cols:
            try:
                print(f"Syncing field 'projects.{name}'...")
                conn.execute(text(f"ALTER TABLE projects ADD COLUMN IF NOT EXISTS {name} {type_}"))
            except Exception as e:
                print(f"Error adding {name}: {e}")
                
        # ── RELATIONSHIPS SYNC ──────────────────────────────────────────────
        print("Ensuring 'project_contents' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS project_contents (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                type VARCHAR,
                content JSONB,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
            )
        """))
        
        conn.commit()
    print("\n✅ DATABASE IS FULLY SYNCHRONIZED AND OPTIMIZED.")

if __name__ == "__main__":
    sycn_pg()
