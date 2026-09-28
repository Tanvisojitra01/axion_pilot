import sqlite3
db_path = "sql_app.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Dropping platform_activity table...")
    cursor.execute("DROP TABLE IF EXISTS platform_activity")
    
    print("Creating platform_activity table with extra_data column...")
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
    print("Success.")
except Exception as e:
    print(e)
    
conn.commit()
conn.close()
