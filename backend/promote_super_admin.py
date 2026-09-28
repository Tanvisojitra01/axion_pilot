import sqlite3

db = sqlite3.connect("sql_app.db")
cur = db.cursor()
cur.execute("UPDATE users SET is_admin = 1 WHERE email = 'niyant214@gmail.com'")
db.commit()
rows = cur.execute("SELECT email, is_admin FROM users WHERE email = 'niyant214@gmail.com'").fetchall()
print("Result:", rows)
db.close()
