import sys, os
sys.path.append(os.getcwd())
import urllib.request, urllib.error
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

import app.main # safely loads all models

from app.auth.jwt_handler import create_access_token
from app.database import SessionLocal
from app.models.user import User
from app.models.project import Project

db = SessionLocal()
user = db.query(User).order_by(User.id.asc()).first()
token = create_access_token({"sub": user.email, "v": user.token_version})

projects = db.query(Project).filter(Project.user_id == user.id).all()
db.close()

for project in projects:
    req = urllib.request.Request(
        f'http://127.0.0.1:8000/api/projects/download/code/{project.id}',
        headers={'Authorization': f'Bearer {token}'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Project {project.id}: SUCCESS! HTTP {response.getcode()} (Len: {len(response.read())})")
    except urllib.error.HTTPError as e:
        print(f"Project {project.id} ERROR: {e.code}")
        try:
            print(e.read().decode())
        except Exception as d:
            print("Could not decode response.", d)
