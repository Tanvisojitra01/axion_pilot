import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

try:
    print("Listing models...")
    for m in genai.list_models():
        print(f"Model: {m.name}, Methods: {m.supported_generation_methods}")
except Exception as e:
    print("ERROR:", str(e))
