# 🔐 Passkey Authentication Setup Guide

## Overview

This project now supports **passwordless authentication using WebAuthn passkeys**. Passkeys are a modern, phishing-resistant alternative to passwords that work with Face ID, Touch ID, Windows Hello, or hardware security keys.

## What Are Passkeys?

Passkeys are cryptographic credentials stored on your device that:
- ✅ Are **phishing-resistant** (signature-based, not password-like)
- ✅ **Don't require passwords** (easier and more secure)
- ✅ Work across devices on most modern platforms
- ✅ Are protected by your device's biometric or PIN
- ✅ Cannot be intercepted over the network

## Quick Start

### 1. Backend Setup

**Requirements:**
- Python 3.8+
- SQLAlchemy
- FastAPI
- `webauthn` library (newly added to `requirements.txt`)

**Installation:**
```bash
cd backend
pip install -r requirements.txt
```

**Run the backend:**
```bash
python -m uvicorn app.main:app --reload
```

The passkey endpoints are now available at:
- `POST /api/auth/passkey/register/start` - Start registration
- `POST /api/auth/passkey/register/complete` - Finish registration
- `POST /api/auth/passkey/login/start` - Start login
- `POST /api/auth/passkey/login/complete` - Finish login
- `GET /api/auth/passkey/list` - List user's passkeys
- `DELETE /api/auth/passkey/{id}` - Delete a passkey

### 2. Environment Configuration

Update your `.env` file with:

```env
# Passkey Configuration
PASSKEY_ORIGIN=http://localhost:3000          # Your frontend URL
PASSKEY_RP_ID=localhost                       # Relying Party ID (domain)
PASSKEY_RP_NAME=ProjectPilot                  # App name
```

**For Production:**
```env
PASSKEY_ORIGIN=https://yourdomain.com
PASSKEY_RP_ID=yourdomain.com
PASSKEY_RP_NAME=Your App Name
```

### 3. Database

The passkey tables are automatically created on first run:
- `passkeys` - Stores user passkeys and credential info
- `passkey_challenges` - Temporary challenge storage for security

### 4. Frontend Implementation

Use the provided `passkey-client.example.js` as a reference:

```javascript
// Register a new passkey
await registerPasskey('admin@example.com', 'Admin', 'My Face ID');

// Login with passkey
const result = await loginWithPasskey('admin@example.com');
console.log('Access token:', result.access_token);
```

## API Reference

### Registration Flow

#### Step 1: Start Registration

```bash
POST /api/auth/passkey/register/start
Content-Type: application/json

{
  "email": "admin@example.com",
  "name": "Admin User"  // optional
}
```

Response:
```json
{
  "options": {
    "challenge": "...",
    "rp": { "name": "ProjectPilot", "id": "localhost" },
    "user": { "id": "...", "name": "...", "displayName": "..." },
    "pubKeyCredParams": [...],
    "authenticatorSelection": { ... },
    "attestation": "direct"
  },
  "challenge": "base64url_encoded_challenge"
}
```

#### Step 2: Authenticator Registration (Client-Side)

The client uses `navigator.credentials.create()` with the options from Step 1.

#### Step 3: Complete Registration

```bash
POST /api/auth/passkey/register/complete
Content-Type: application/json

{
  "email": "admin@example.com",
  "credential": {
    "id": "credential_id",
    "rawId": "base64url_raw_id",
    "response": {
      "clientDataJSON": "base64url_...",
      "attestationObject": "base64url_..."
    },
    "type": "public-key"
  },
  "challenge": "base64url_encoded_challenge",
  "nickname": "My Face ID"
}
```

Response:
```json
{
  "id": 1,
  "nickname": "My Face ID",
  "created_at": "2024-01-15T10:30:00",
  "last_used_at": null,
  "is_active": true
}
```

### Authentication (Login) Flow

#### Step 1: Start Authentication

```bash
POST /api/auth/passkey/login/start
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

Response:
```json
{
  "options": {
    "challenge": "...",
    "timeout": 60000,
    "userVerification": "required",
    "allowCredentials": [...]
  },
  "challenge": "base64url_encoded_challenge"
}
```

#### Step 2: Authenticator Authentication (Client-Side)

The client uses `navigator.credentials.get()` with the options from Step 1.

#### Step 3: Complete Authentication

```bash
POST /api/auth/passkey/login/complete
Content-Type: application/json

{
  "email": "admin@example.com",
  "credential": {
    "id": "credential_id",
    "rawId": "base64url_raw_id",
    "response": {
      "clientDataJSON": "base64url_...",
      "authenticatorData": "base64url_...",
      "signature": "base64url_...",
      "userHandle": "base64url_..."
    },
    "type": "public-key"
  },
  "challenge": "base64url_encoded_challenge"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### Passkey Management

#### List Passkeys

```bash
GET /api/auth/passkey/list
Authorization: Bearer <access_token>
```

Response:
```json
{
  "passkeys": [
    {
      "id": 1,
      "nickname": "My Face ID",
      "created_at": "2024-01-15T10:30:00",
      "last_used_at": "2024-01-15T11:00:00",
      "is_active": true
    }
  ]
}
```

#### Delete Passkey

```bash
DELETE /api/auth/passkey/{passkey_id}
Authorization: Bearer <access_token>
```

## Setting Up for admin@example.com

### 1. Ensure User Exists

First, make sure the user account exists:

```bash
cd backend
python setup_passkey.py
```

This script will:
- ✓ Check if the user exists
- ✓ List existing passkeys
- ✓ Show complete setup instructions

### 2. Device Requirements

To register a passkey, you need **one of**:

**Platform Authenticators (built-in):**
- ✅ Face ID (iPhone, iPad, Mac)
- ✅ Touch ID (iPhone, iPad, Mac)
- ✅ Windows Hello (Windows 10+)
- ✅ Android Fingerprint/Face
- ✅ Android screen lock (PIN, pattern)

**External Authenticators:**
- ✅ Yubikey 5 Series
- ✅ Titan Security Key
- ✅ Google Titan
- ✅ Other FIDO2-compliant keys

### 3. Browser Support

Passkeys work in:
- ✅ Chrome/Edge 67+ (Windows, Mac, Linux, Android)
- ✅ Firefox 60+ (Windows, Mac, Linux, Android)
- ✅ Safari 13+ (Mac, iPhone, iPad)
- ✅ Opera 54+

### 4. Registration Steps

1. **Start the app:**
   ```bash
   # Backend
   cd backend && python -m uvicorn app.main:app --reload
   
   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

2. **Navigate to the passkey registration page**

3. **Click "Register Passkey"**

4. **Verify your identity** with your device:
   - Face ID / Touch ID (Mac, iPhone)
   - Windows Hello (Windows PC)
   - Fingerprint (Android phone)
   - Security key (any device with USB)

5. **Passkey is saved** to your device

6. **Login anytime** with your passkey

## Troubleshooting

### "Authenticator not available"

**Causes:**
- Your device doesn't support WebAuthn
- You're using an old browser
- Platform authenticator isn't set up

**Solutions:**
- Install a security key (Yubikey)
- Update your browser
- Enable biometrics on your device
- Try a different device

### "Failed to load/verify credential"

**Causes:**
- Invalid challenge
- Credential registration data corrupted
- Sign count mismatch

**Solutions:**
- Start registration again
- Check browser console for errors
- Verify server logs: `tail -f /tmp/projectpilot.log`

### "Cross-origin request blocked"

**Causes:**
- `PASSKEY_ORIGIN` doesn't match your frontend URL
- CORS not configured correctly

**Solutions:**
```env
# Check your frontend URL
PASSKEY_ORIGIN=http://localhost:3000  # for development
PASSKEY_ORIGIN=https://yourdomain.com # for production
```

### "Cloned authenticator detected"

**Causes:**
- Someone cloned your security key
- Synchronization issue

**Solution:**
- The passkey is automatically deactivated for security
- Register a new passkey
- Use a genuine, up-to-date security key

## Security Features

✓ **Cryptographic signing** - Prevents phishing
✓ **Cloned authenticator detection** - Uses sign count protocol
✓ **Challenge-response** - Replay attack prevention
✓ **User verification** - Biometric/PIN required
✓ **Attestation verification** - Ensures credential origin
✓ **Token versioning** - Session invalidation support

## Database Schema

### passkeys table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `user_id` | Integer | Foreign key to users |
| `credential_id` | String | WebAuthn credential ID |
| `public_key` | Text | COSE public key (hex) |
| `sign_count` | Integer | Counter for cloned detection |
| `nickname` | String | User-friendly name |
| `created_at` | DateTime | Registration timestamp |
| `last_used_at` | DateTime | Last login timestamp |
| `is_active` | Boolean | Active/deactivated status |

### passkey_challenges table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `email` | String | User email |
| `challenge` | String | Base64url challenge |
| `challenge_type` | String | "registration" or "authentication" |
| `expires_at` | DateTime | Challenge expiry (15 min default) |
| `created_at` | DateTime | Challenge generation time |

## Next Steps

1. **Test locally** - Use `passkey-client.example.js` as reference
2. **Integrate into UI** - Add registration/login buttons
3. **Mobile apps** - Use native WebAuthn support (iOS 14+, Android 7+)
4. **Backup codes** - Consider adding recovery options
5. **Multiple passkeys** - Support user having passkeys on different devices

## Resources

- [WebAuthn.io](https://webauthn.io) - Official WebAuthn spec
- [MDN WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [Python WebAuthn Library](https://github.com/duo-labs/py_webauthn)
- [FIDO Alliance](https://fidoalliance.org)

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Test with `curl` using provided API examples
4. Verify environment variables in `.env`

---

**Questions?** Check `setup_passkey.py` for more utilities and examples!
