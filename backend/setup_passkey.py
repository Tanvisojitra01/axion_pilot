#!/usr/bin/env python3
"""
Passkey Setup Utility for ProjectPilot
This script helps set up passkey authentication for a specific email.

NOTE: In production, passkeys must be registered through the WebAuthn flow
(using a browser and a physical authenticator like Face ID, Yubikey, etc.)

This script provides setup instructions and admin tools for development/testing.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment
load_dotenv(Path(__file__).parent / ".env")

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.passkey import PassKey


def ensure_db():
    """Ensure database tables are created."""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")


def list_passkeys_for_user(email: str):
    """List all passkeys for a user."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"✗ User not found: {email}")
            return False
        
        passkeys = db.query(PassKey).filter(PassKey.user_id == user.id).all()
        if not passkeys:
            print(f"  No passkeys found for {email}")
            return True
        
        print(f"  Passkeys for {email}:")
        for pk in passkeys:
            status = "✓ ACTIVE" if pk.is_active else "✗ INACTIVE"
            print(f"    - {pk.nickname} (ID: {pk.id}) - Created: {pk.created_at} - {status}")
            if pk.last_used_at:
                print(f"      Last used: {pk.last_used_at}")
        
        return True
    finally:
        db.close()


def show_setup_instructions(email: str):
    """Show step-by-step instructions for setting up a passkey."""
    print(f"""
╭────────────────────────────────────────────────────────────────────╮
│                    Passkey Setup Instructions                      │
╰────────────────────────────────────────────────────────────────────╯

Email: {email}

STEP 1: Start Passkey Registration
─────────────────────────────────────

Make a POST request to:
  POST http://localhost:8000/api/auth/passkey/register/start
  
Body (JSON):
  {{
    "email": "{email}",
    "name": "My First Passkey"
  }}

Response will contain:
  - "options": WebAuthn registration options
  - "challenge": A unique challenge string (save this!)

STEP 2: Create Passkey with Your Device
─────────────────────────────────────────

Use your browser's WebAuthn API or a client library to:
  1. Click "Register Passkey" in your app
  2. Choose your authenticator (Face ID, Touch ID, Windows Hello, Security Key, etc.)
  3. Verify your identity when prompted
  4. The browser will generate a credential

STEP 3: Complete Registration
──────────────────────────────

Send the credential to:
  POST http://localhost:8000/api/auth/passkey/register/complete

Body (JSON):
  {{
    "email": "{email}",
    "credential": <credential from step 2>,
    "challenge": "<challenge from step 1>",
    "nickname": "My Yubikey"
  }}

Response:
  {{
    "id": 1,
    "nickname": "My Yubikey",
    "created_at": "2024-01-15T10:30:00",
    "is_active": true
  }}

STEP 4: Login with Passkey
────────────────────────────

To login later:
  
  a) Start login:
     POST http://localhost:8000/api/auth/passkey/login/start
     Body: {{"email": "{email}"}}
     
  b) Authenticate with your passkey when prompted
  
  c) Complete login:
     POST http://localhost:8000/api/auth/passkey/login/complete
     Body:
       {{
         "email": "{email}",
         "credential": <assertion from passkey>,
         "challenge": "<challenge from step a>"
       }}
     
     Response:
       {{
         "access_token": "...",
         "token_type": "bearer"
       }}

FRONTEND IMPLEMENTATION
────────────────────────

See `passkey-client.example.js` for a complete JavaScript implementation.

BENEFITS OF PASSKEYS
──────────────────────

✓ No passwords to remember or steal
✓ Phishing-resistant (cryptographic signature)
✓ Works with Face ID, Touch ID, Windows Hello, Security Keys
✓ Faster than passwords
✓ Can sync across devices (platform-dependent)

TROUBLESHOOTING
─────────────────

Q: "Authenticator not available"
A: Your device doesn't support WebAuthn. Try:
   - Face ID / Touch ID (Mac, iPhone)
   - Windows Hello (Windows 10+)
   - Yubikey or other FIDO2 security key

Q: "Platform authenticator unavailable"
A: This usually means your device doesn't support fingerprint/face recognition.
   You can still use external security keys (Yubikey 5, etc.)

Q: "Invalid origin"
A: Make sure your app is loaded from the correct origin.
   Current origin: {os.environ.get('PASSKEY_ORIGIN', 'http://localhost:3000')}

More info: https://webauthn.io

╭────────────────────────────────────────────────────────────────────╮
│                          TESTS (CURL)                             │
╰────────────────────────────────────────────────────────────────────╯

# List passkeys
curl http://localhost:8000/api/auth/passkey/list -H "Authorization: Bearer YOUR_TOKEN"

# Check user status
curl http://localhost:8000/api/users/me -H "Authorization: Bearer YOUR_TOKEN"

""")


def main():
    """Main entry point."""
    print("""
╭════════════════════════════════════════════════════════════════════╮
│          ProjectPilot - Passkey Setup Utility v1.0                │
╰════════════════════════════════════════════════════════════════════╯
""")
    
    ensure_db()
    
    email = input("\nEnter email (default: admin@example.com): ").strip()
    if not email:
        email = "admin@example.com"
    
    print(f"\nChecking user: {email}")
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"✗ User not found. Please sign up first.")
            sys.exit(1)
        
        print(f"✓ User found: {user.name}")
        print(f"  Account ID: {user.id}")
        print(f"  Created: {user.created_at}")
        print(f"  Status: {'ACTIVE' if user.is_active else 'INACTIVE'}")
        
    finally:
        db.close()
    
    print("\n" + "="*70)
    print("Existing Passkeys:")
    print("="*70)
    list_passkeys_for_user(email)
    
    print("\n" + "="*70)
    show_setup_instructions(email)
    
    print("\n✓ Setup instructions shown. Start the backend with:")
    print("  cd backend && python -m uvicorn app.main:app --reload")
    print("\nThen follow the STEP-BY-STEP instructions above!")


if __name__ == "__main__":
    main()
