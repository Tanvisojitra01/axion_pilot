from passlib.context import CryptContext

# ── Password Hashing ───────────────────────────────────────────────────────────
# Iterations: Cost factor of 12 for high resistance to brute force attacks.
# Deprecated: pbkdf2 as bcrypt is superior for modern apps.
# Use PBKDF2-SHA256 as primary for stability (bcrypt has issues on some Windows setups)
# bcrypt is kept as secondary for backward compatibility
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """True if password matches stored hash, False otherwise."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate Secure Bcrypt Hash."""
    return pwd_context.hash(password)
