import sqlite3

def migrate():
    db = sqlite3.connect("sql_app.db")
    cur = db.cursor()
    
    print("Starting database migration...")
    
    # ── Migrate Users Table ───────────────────────────────────────────────────
    try:
        print("Adding 'role' and 'last_login' to users table...")
        cur.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
        cur.execute("ALTER TABLE users ADD COLUMN last_login DATETIME")
        print("Users table updated.")
    except sqlite3.OperationalError as e:
        print(f"Users table notice: {e}")

    # ── Migrate Projects Table ────────────────────────────────────────────────
    try:
        print("Adding 'description', 'progress', and 'deadline' to projects table...")
        cur.execute("ALTER TABLE projects ADD COLUMN description TEXT")
        cur.execute("ALTER TABLE projects ADD COLUMN progress INTEGER DEFAULT 0")
        cur.execute("ALTER TABLE projects ADD COLUMN deadline DATETIME")
        print("Projects table updated.")
    except sqlite3.OperationalError as e:
        print(f"Projects table notice: {e}")

    db.commit()
    db.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
