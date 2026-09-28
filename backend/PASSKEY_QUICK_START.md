# Passkey Authentication - Quick Start

## What Just Got Set Up

Your ProjectPilot backend now supports **passwordless authentication using passkeys** (WebAuthn). This means:

✅ **No more passwords** for admin@example.com
✅ **Use Face ID, Touch ID, or security keys** instead
✅ **Phishing-proof** - Can't steal something you must prove you own
✅ **Faster login** - No typing required

## Files Added/Modified

### New Backend Files
```
backend/app/models/passkey.py              → Database models for passkeys
backend/app/auth/passkey_handler.py        → WebAuthn cryptography
backend/app/api/passkey.py                 → API endpoints
backend/app/schemas/passkey.py             → Request/response schemas
backend/setup_passkey.py                   → Setup utility script
backend/passkey-client.example.js          → Frontend implementation reference
backend/PASSKEY_SETUP.md                   → Complete documentation
```

### Modified Files
```
backend/app/models/user.py                 → Added passkeys relationship
backend/app/main.py                        → Registered passkey router
backend/requirements.txt                   → Added webauthn library
backend/.env                               → Added passkey config
```

## Quick Test (Without Frontend UI)

### 1. Install & Start Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 2. Verify Setup

```bash
python setup_passkey.py
```

Enter: `admin@example.com`

### 3. Check Passkey Endpoints

```bash
# Test 1: Check if user exists
curl http://localhost:8000/api/auth/passkey/login/start \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# If you get an error about "No active passkeys" - that's expected!
# No passkeys registered yet.
```

## Step-by-Step Setup Process

### For Desktop/Mac Users
1. **Chrome** or **Safari** on Mac (built-in Face ID/Touch ID)
2. Go to your app
3. Click "Register Passkey"
4. Position your face or use Touch ID
5. Done! You can now login without a password

### For iPhone/iPad Users
1. **Safari** on iOS 14+
2. Go to your app
3. Click "Register Passkey"
4. Use Face ID or Touch ID to register
5. Open the app again → Tap "Login with Passkey"
6. Done!

### For Windows Users
1. **Chrome** or **Edge**
2. Go to your app
3. Click "Register Passkey"
4. Use Windows Hello (face, fingerprint, PIN)
5. Done! You can now login without a password

### For Android Users
1. **Chrome** 
2. Go to your app
3. Click "Register Passkey"
4. Use your phone's fingerprint/face
5. Done!

## API Endpoints (For Developers)

### Register a Passkey
```bash
# Step 1: Start registration
curl -X POST http://localhost:8000/api/auth/passkey/register/start \
  -H "Content-Type: application/json" \
  -d {"email":"admin@example.com", "name":"My Passkey"}

# Response: { "options": {...}, "challenge": "xyz..." }

# Step 2: Use browser/client to create credential with authenticator

# Step 3: Complete registration
curl -X POST http://localhost:8000/api/auth/passkey/register/complete \
  -H "Content-Type: application/json" \
  -d {"email":"admin@example.com", "credential":{...}, "challenge":"xyz", "nickname":"My Face ID"}
```

### Login with a Passkey
```bash
# Step 1: Start login
curl -X POST http://localhost:8000/api/auth/passkey/login/start \
  -H "Content-Type: application/json" \
  -d {"email":"admin@example.com"}

# Response: { "options": {...}, "challenge": "xyz..." }

# Step 2: Use browser/client to authenticate with passkey

# Step 3: Complete login
curl -X POST http://localhost:8000/api/auth/passkey/login/complete \
  -H "Content-Type: application/json" \
  -d {"email":"admin@example.com", "credential":{...}, "challenge":"xyz"}

# Response: { "access_token": "...", "token_type": "bearer" }
```

## Frontend Integration

Use `passkey-client.example.js` as your reference. Example:

```javascript
// Include the library
<script src="passkey-client.example.js"></script>

// Register
<button onclick="registerPasskey('admin@example.com', 'Admin', 'My Face ID')
  .then(r => alert('✓ Registered!'))
  .catch(e => alert('✗ ' + e.message))">
  Register Passkey
</button>

// Login
<button onclick="loginWithPasskey('admin@example.com')
  .then(r => {
    localStorage.setItem('token', r.access_token);
    window.location.href = '/dashboard';
  })
  .catch(e => alert('✗ ' + e.message))">
  Login with Passkey
</button>
```

## Database

Automatic on first run:
- `passkeys` table - Stores all passkeys
- `passkey_challenges` table - Temporary challenge storage

## Troubleshooting

### "Authenticator not available"
→ Your device doesn't support WebAuthn yet
→ Try: Yubikey 5, Google Titan, or newer device

### "Platform authenticator unavailable"
→ Your device doesn't have biometrics set up
→ Use Windows Hello, Face ID, or a security key

### "Invalid origin" 
→ Update `.env`:
```env
PASSKEY_ORIGIN=http://localhost:3000
PASSKEY_RP_ID=localhost
```

## What Happens Now

1. ✓ Backend supports passkey registration & login
2. ✓ Database ready with `passkeys` table
3. ✓ API endpoints available
4. ⏳ You need to:
   - Integrate `passkey-client.example.js` into frontend
   - Add UI buttons for "Register Passkey" and "Login with Passkey"
   - Test with your device

## Next: Frontend Integration

### React Example
```jsx
import { registerPasskey, loginWithPasskey } from './passkey-client.js';

export function PasskeyAuth() {
  const email = 'admin@example.com';

  const handleRegister = async () => {
    try {
      const result = await registerPasskey(email, 'Admin', 'My Device');
      alert(`✓ Passkey registered: ${result.nickname}`);
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await loginWithPasskey(email);
      localStorage.setItem('token', result.access_token);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleRegister}>Register Passkey</button>
      <button onClick={handleLogin}>Login with Passkey</button>
    </div>
  );
}
```

## Features Added

✅ **WebAuthn Registration** - Register passkeys
✅ **WebAuthn Authentication** - Login with passkeys
✅ **Cloned Authenticator Detection** - Detects compromised keys
✅ **Challenge-Response Flow** - Replay attack prevention
✅ **Temporary Challenge Storage** - Auto-expires in 15 minutes
✅ **User Verification** - Biometric/PIN required
✅ **Passkey Management** - List, delete, rename passkeys
✅ **Database Integration** - SQLAlchemy models with relations
✅ **Error Handling** - User-friendly error messages
✅ **Logging** - Complete audit trail

## Documentation

- Full docs: [PASSKEY_SETUP.md](./PASSKEY_SETUP.md)
- Implementation reference: [passkey-client.example.js](./passkey-client.example.js)
- Setup utility: [setup_passkey.py](./setup_passkey.py)

---

**Ready?** Start with `python setup_passkey.py` to see detailed instructions!
