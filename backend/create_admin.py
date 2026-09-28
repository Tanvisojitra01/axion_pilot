from app.database import SessionLocal
from app.models.user import User
from app.auth.utils import get_password_hash

def create_admin_user():
    db = SessionLocal()
    email = "admin@test.com"
    password = "password123"
    
    # Check if exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        db.delete(existing_user)
        db.commit()
        print(f"🗑️ Deleted existing {email}")

    # Create new
    hashed_password = get_password_hash(password)
    new_user = User(
        email=email,
        hashed_password=hashed_password,
        is_active=True,
        plan="pro"
    )
    db.add(new_user)
    db.commit()
    print(f"✅ Created fresh user: {email} / {password}")
    db.close()

if __name__ == "__main__":
    create_admin_user()
