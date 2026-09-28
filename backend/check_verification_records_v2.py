import os
from sqlalchemy import desc
from app.database import SessionLocal
from app.models.user import SignupVerification, LoginVerification, ForgotPasswordVerification

def check():
    db = SessionLocal()
    
    try:
        print("--- RECENT SIGNUP VERIFICATIONS ---")
        signups = db.query(SignupVerification).order_by(desc(SignupVerification.created_at)).limit(5).all()
        for s in signups:
            print(f"ID: {s.id} | Email: {s.email} | Created At: {s.created_at} | Expires: {s.expires_at}")

        print("\n--- RECENT LOGIN VERIFICATIONS ---")
        logins = db.query(LoginVerification).order_by(desc(LoginVerification.created_at)).limit(5).all()
        for l in logins:
            print(f"ID: {l.id} | User ID: {l.user_id} | Created At: {l.created_at} | Expires: {l.expires_at}")

        print("\n--- RECENT FORGOT PWD VERIFICATIONS ---")
        fp = db.query(ForgotPasswordVerification).order_by(desc(ForgotPasswordVerification.created_at)).limit(5).all()
        for f in fp:
            print(f"ID: {f.id} | User ID: {f.user_id} | Created At: {f.created_at} | Expires: {f.expires_at}")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
