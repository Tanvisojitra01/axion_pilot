import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = "AIzaSyDGau0LMAEZLJ38dvZc7LJOIQ-wKwRpO_s"

genai.configure(api_key=api_key)

try:
    print("Listing models for NEW key...")
    for m in genai.list_models():
        print(f"Model: {m.name}")
except Exception as e:
    print("ERROR:", str(e))
