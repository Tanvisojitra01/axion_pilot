import os
from google import genai
from dotenv import load_dotenv
from pathlib import Path

# Load .env
load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
    print("Listing models...")
    for model in client.models.list():
        print(f"Model: {model.name}, Supported Methods: {model.supported_generation_methods}")
except Exception as e:
    print(f"ERROR: {e}")
