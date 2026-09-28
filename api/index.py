import sys
from pathlib import Path

# Ensure the backend package directory is on sys.path when deployed from the project root
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from app.main import app
from mangum import Mangum

_mangum = Mangum(app, lifespan="off")

def handler(request, context):
    return _mangum(request, context)
