import os
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.auth.utils import get_password_hash

DB_FILE = "sql_app.db"

def reset_database():
    print(f"🔄 Check if {DB_FILE} exists...")
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        print(f"🗑️ Deleted {DB_FILE}")
    else:
        print(f"⚡ {DB_FILE} not found, creating new one...")

    print("🏗️ Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")

def create_admin_user():
    db = SessionLocal()
    email = "admin@test.com"
    password = "khilan@7254"
    
    hashed_password = get_password_hash(password)
    new_user = User(
        email=email,
        hashed_password=hashed_password,
        is_active=True,
        plan="pro"
    )
    db.add(new_user)
    db.commit()
    print(f"👤 Created Admin User:")
    print(f"   Email: {email}")
    print(f"   Pass:  {password}")
    db.close()

if __name__ == "__main__":
    reset_database()
    create_admin_user()
    print("\n✅ SETUP COMPLETE! You can now run the server.")
