import os
from dotenv import load_dotenv
load_dotenv()
from app.core.generators.llm_client import LLMClient

def test():
    # Test 1: Empty api_key (should use .env)
    print("Testing Fallback to .env...")
    client = LLMClient(api_key="")
    print(f"Detected Provider: {client.provider}")
    print(f"Using Model: {client.model}")
    print(f"Key used (first 10): {client.api_key[:10]}")
    try:
        res = client.generate("Say hi")
        print(f"SUCCESS: {res}")
    except Exception as e:
        print(f"FAILED: {e}")

    # Test 2: Dots (should ignore and use .env)
    print("\nTesting Dots Case (browser auto-fill fix)...")
    client = LLMClient(api_key="...................")
    print(f"Detected Provider: {client.provider}")
    print(f"Key used (first 10): {client.api_key[:10]}")
    try:
        res = client.generate("Say hi again")
        print(f"SUCCESS: {res}")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test()
