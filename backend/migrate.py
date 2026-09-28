import sqlite3

db_path = "sql_app.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Add is_admin to users
    print("Adding is_admin to users table...")
    cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
    print("Column is_admin added successfully.")
except sqlite3.OperationalError as e:
    print(f"Note: {e}")

try:
    # Create platform_activity table
    print("Creating platform_activity table...")
    cursor.execute("""
        CREATE TABLE platform_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action_type TEXT,
            description TEXT,
            extra_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    print("Table platform_activity created successfully.")
except sqlite3.OperationalError as e:
    print(f"Note: {e}")

conn.commit()
conn.close()
print("Migration completed.")
