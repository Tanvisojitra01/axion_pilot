import os
from google import genai
from dotenv import load_dotenv
from pathlib import Path

# Load .env
load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing Gemini API Key: {'***' + api_key[-4:] if api_key else 'NOT SET'}")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Say 'API is working' if you can read this."
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
