import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
if not BACKEND_DIR.exists():
    BACKEND_DIR = ROOT.parent / "backend"
if not BACKEND_DIR.exists():
    raise FileNotFoundError(
        f"Backend folder not found. Checked: {ROOT / 'backend'} and {ROOT.parent / 'backend'}"
    )
sys.path.insert(0, str(BACKEND_DIR))

try:
    from app.main import app
except ModuleNotFoundError as exc:
    raise ModuleNotFoundError(
        f"Could not import app.main. Make sure the backend directory exists and contains app/main.py.\n"
        f"Backend path: {BACKEND_DIR}"
    ) from exc

from mangum import Mangum

_mangum = Mangum(app, lifespan="off")

def handler(request, context):
    return _mangum(request, context)