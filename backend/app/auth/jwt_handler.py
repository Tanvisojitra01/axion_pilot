from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional, Dict
from app.schemas.user import TokenData
import os

# ── JWT Security ──────────────────────────────────────────────────────────────
# Generate with: python -c "import secrets; print(secrets.token_hex(32))"
# CRITICAL: No fallback allowed. App must crash if SECRET_KEY is missing/weak.
SECRET_KEY = os.environ.get("SECRET_KEY", "")
if not SECRET_KEY or len(SECRET_KEY) < 32:
    raise RuntimeError(
        "CRITICAL: SECRET_KEY env var is missing or too short (< 32 hex chars). "
        "The server will not start without this for production security."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7 days


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Issue a new JWT. Includes 'v' for token version (revocation check)."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # v = token_version, used for instant revocation on password change
    to_encode.update({"exp": expire, "v": to_encode.get("v", 1)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, credentials_exception) -> Dict:
    """Decode and verify JWT. Returns the full payload dict."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("sub"):
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception
