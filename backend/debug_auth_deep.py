from app.database import SessionLocal
from app.models.user import User
from app.auth.utils import verify_password, get_password_hash, pwd_context

email = "khilanmangukiya@gmail.com"
password = "password123"

db = SessionLocal()
user = db.query(User).filter(User.email == email).first()

print(f"--- DEBUGGING AUTH FOR: {email} ---")

if not user:
    print("❌ User not found in DB!")
else:
    print(f"✅ User found: {user.email}")
    print(f"Stored Hash: {user.hashed_password}")
    
    # Test Verification
    is_valid = verify_password(password, user.hashed_password)
    print(f"verify_password('{password}', stored_hash) -> {is_valid}")
    
    if is_valid:
        print("✅ The stored hash MATCHES 'password123'. Login *should* work.")
    else:
        print("❌ The stored hash DOES NOT match 'password123'.")
        
        # Test Generation
        new_hash = get_password_hash(password)
        print(f"New Hash for '{password}': {new_hash}")
        print(f"Verify New Hash -> {verify_password(password, new_hash)}")
        
        # Force Update
        print("Forcing password update locally...")
        user.hashed_password = new_hash
        db.commit()
        print("✅ Password forced to new hash in DB.")

db.close()
