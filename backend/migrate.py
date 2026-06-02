import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "eduvise.db")
conn = sqlite3.connect(db_path)
try:
    conn.execute('ALTER TABLE users ADD COLUMN badges VARCHAR DEFAULT "[]"')
    print("Added badges column to users table.")
except Exception as e:
    print("Error or already exists:", e)
conn.commit()
conn.close()
