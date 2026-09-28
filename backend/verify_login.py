import requests

API_URL = "http://127.0.0.1:8000/api/auth/login"

def test_login(email, password):
    print(f"Attempting login for: {email} at {API_URL}")
    try:
        response = requests.post(
            API_URL,
            data={"username": email, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("✅ Login Successful!")
            print("Token:", response.json().get("access_token")[:20] + "...")
        else:
            print("❌ Login Failed.")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("Ensure the backend server is running on port 8000!")

if __name__ == "__main__":
    test_login("khilanmangukiya@gmail.com", "password123")
