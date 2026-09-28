import sqlite3
import os

db_path = "pilot.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("Columns in users table:")
    for col in columns:
        print(f"{col[1]} ({col[2]})")
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='platform_activity'")
    table = cursor.fetchone()
    print(f"\nTable platform_activity exists: {table is not None}")
    
    conn.close()
else:
    print(f"Database {db_path} not found")
