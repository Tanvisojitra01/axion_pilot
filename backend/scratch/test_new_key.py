import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("backend/.env")
# Using the NEW key found in line 31
api_key = "AIzaSyDGau0LMAEZLJ38dvZc7LJOIQ-wKwRpO_s"

genai.configure(api_key=api_key)

try:
    print("Testing NEW key...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    print("SUCCESS:", response.text)
except Exception as e:
    print("ERROR:", str(e))
