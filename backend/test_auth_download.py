import os, json
import urllib.request, urllib.error
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

import app.main # safely loads all models

from app.auth.jwt_handler import create_access_token
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).order_by(User.id.asc()).first()
if not user:
    print("NO USER")
    db.close()
    exit(1)

token = create_access_token({"sub": user.email, "v": user.token_version})
db.close()

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/projects/download/code/1',
    headers={'Authorization': f'Bearer {token}'}
)
try:
    with urllib.request.urlopen(req) as response:
        print("SUCCESS! HTTP", response.getcode())
        print("Length:", len(response.read()))
except urllib.error.HTTPError as e:
    print('ERROR:', e.code)
    try:
        print(e.read().decode())
    except Exception as d:
        print("Could not decode response.", d)
