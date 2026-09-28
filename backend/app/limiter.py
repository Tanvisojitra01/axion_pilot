from slowapi import Limiter
from slowapi.util import get_remote_address

# ── Shared Application Limiter ────────────────────────────────────────────────
# Use a unified instance across all routers so limit states are tracked correctly.
limiter = Limiter(key_func=get_remote_address)
