import os
import sys
from sqlalchemy.orm import Session

# Add the current directory to sys.path to import app
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models.user import User
from app.auth.utils import get_password_hash

def reset_password(email, new_password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User {email} not found.")
            return
        
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        print(f"Password for {email} has been reset successfully to: {new_password}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_password("niyant214@gmail.com", "Admin@123")
