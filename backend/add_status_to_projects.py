import sqlite3
import os

db_path = r"c:\Users\niyan\OneDrive\Desktop\pilot\backend\sql_app.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Adding status column to projects table...")
    # Add status column with default value 'active'
    cursor.execute("ALTER TABLE projects ADD COLUMN status VARCHAR DEFAULT 'active'")
    conn.commit()
    print("Column 'status' added successfully to 'projects' table.")
except sqlite3.OperationalError as e:
    print(f"Error or Note: {e}")

conn.close()
