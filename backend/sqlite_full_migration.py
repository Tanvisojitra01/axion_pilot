"""
sqlite_full_migration.py
─────────────────────────
Upgrades current User table and creates the 3 new Verification tables securely.
Safe to re-run.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sql_app.db")


def table_exists(cur, table: str) -> bool:
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,))
    return cur.fetchone() is not None


def column_exists(cur, table: str, column: str) -> bool:
    cur.execute(f"PRAGMA table_info({table})")
    return any(row[1] == column for row in cur.fetchall())


def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 1. users table
    if not column_exists(cur, "users", "token_version"):
        cur.execute("ALTER TABLE users ADD COLUMN token_version INTEGER DEFAULT 1 NOT NULL")
        print("users: added token_version")

    # 2. signup_verifications
    if not table_exists(cur, "signup_verifications"):
        cur.execute("""
            CREATE TABLE signup_verifications (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                email          TEXT    UNIQUE NOT NULL,
                mobile         TEXT    NOT NULL,
                name           TEXT    NOT NULL,
                hashed_password TEXT   NOT NULL,
                email_otp_hash TEXT    NOT NULL,
                mobile_otp_hash TEXT   NOT NULL,
                expires_at     DATETIME NOT NULL,
                created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
                attempt_count  INTEGER  DEFAULT 0
            ) 
        """)
        print("signup_verifications: created table")

    # 3. login_verifications
    if not table_exists(cur, "login_verifications"):
        cur.execute("""
            CREATE TABLE login_verifications (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id      INTEGER NOT NULL,
                otp_hash     TEXT    NOT NULL,
                expires_at   DATETIME NOT NULL,
                created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
                attempt_count INTEGER  DEFAULT 0
            )
        """)
        print("login_verifications: created table")

    # 4. forgot_password_verifications
    if not table_exists(cur, "forgot_password_verifications"):
        cur.execute("""
            CREATE TABLE forgot_password_verifications (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id      INTEGER NOT NULL,
                otp_hash     TEXT    NOT NULL,
                expires_at   DATETIME NOT NULL,
                created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
                attempt_count INTEGER  DEFAULT 0
            )
        """)
        print("forgot_password_verifications: created table")

    conn.commit()
    conn.close()
    print("✅ Full security migration complete.")


if __name__ == "__main__":
    migrate()
