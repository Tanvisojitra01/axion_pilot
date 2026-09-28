from app.database import SessionLocal
from app.models.user import User

def check_admin():
    db = SessionLocal()
    users = db.query(User).all()
    print("--- EXISTING USERS ---")
    for u in users:
        print(f"ID: {u.id} | Email: {u.email} | Active: {u.is_active}")
    print("----------------------")
    
    admin = db.query(User).filter(User.email == "admin@test.com").first()
    if admin:
        print("✅ 'admin@test.com' exists.")
    else:
        print("❌ 'admin@test.com' DOES NOT exist.")
    db.close()

if __name__ == "__main__":
    check_admin()
