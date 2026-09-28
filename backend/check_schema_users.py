import sqlite3
conn = sqlite3.connect('sql_app.db')
cursor = conn.cursor()
try:
    cursor.execute("PRAGMA table_info(users)")
    print(cursor.fetchall())
except Exception as e:
    print(e)
conn.close()
