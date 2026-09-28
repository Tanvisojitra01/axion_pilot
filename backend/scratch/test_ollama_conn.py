import requests
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env from parent dir
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/") + "/api/tags"

print(f"Checking Ollama at: {OLLAMA_URL}")

try:
    response = requests.get(OLLAMA_URL, timeout=5)
    if response.status_code == 200:
        models = response.json().get("models", [])
        print("SUCCESS: Ollama is running!")
        print(f"Available models: {[m['name'] for m in models]}")
    else:
        print(f"ERROR: Ollama returned status code: {response.status_code}")
except Exception as e:
    print(f"FAILURE: Failed to connect to Ollama: {e}")
