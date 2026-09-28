from app.database import SessionLocal
from app.models.user import User
from app.auth.utils import get_password_hash

def reset_password(email, new_password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User {email} not found!")
            return

        hashed_password = get_password_hash(new_password)
        user.hash_password = hashed_password
        db.commit()
        print(f"✅ Password for {email} has been reset to: {new_password}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_password("admin@example.com", "password123")
