import os
import litellm
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GEMINI_API_KEY")

models = ["gemini/gemini-2.0-flash-lite", "gemini/gemini-flash-latest", "gemini/gemini-pro-latest"]

for model in models:
    print(f"Testing {model}...")
    try:
        response = litellm.completion(
            model=model,
            messages=[{"role": "user", "content": "Hello"}],
            api_key=api_key
        )
        print(f"SUCCESS {model}:", response.choices[0].message.content)
        break
    except Exception as e:
        print(f"ERROR {model}:", str(e))
