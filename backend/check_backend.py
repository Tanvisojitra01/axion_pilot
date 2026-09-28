"""
Simple backend verification script for Windows/Mac/Linux
Tests API endpoints to ensure backend is running properly
"""

import subprocess
import time
import requests
import sys

def run_command(cmd, description):
    """Run a shell command and check for errors"""
    print(f"\n📋 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"   ✅ Success")
            return True
        else:
            print(f"   ⚠️  Output: {result.stderr[:100] if result.stderr else result.stdout[:100]}")
            return False
    except subprocess.TimeoutExpired:
        print(f"   ⏱️  Timeout")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def check_backend():
    """Check if backend is running"""
    print("\n🔍 Checking Backend Health...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        if response.status_code == 200:
            print("   ✅ Backend is RUNNING")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"   ❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Backend is NOT RUNNING on port 8000")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    print("=" * 70)
    print("🚀 AxionX Backend Verification")
    print("=" * 70)

    # Check Python
    if not run_command("python --version", "Checking Python"):
        print("\n❌ Python not found. Please install Python 3.8+")
        sys.exit(1)

    # Check pip
    if not run_command("pip --version", "Checking pip"):
        print("\n❌ pip not found")
        sys.exit(1)

    # Check backend dependencies
    print("\n📦 Checking Backend Dependencies...")
    deps_ok = True
    for package in ["fastapi", "uvicorn", "sqlalchemy", "pydantic"]:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - MISSING")
            deps_ok = False

    if not deps_ok:
        print("\n   Installing requirements...")
        if run_command("pip install -r backend/requirements.txt", "Installing dependencies"):
            print("   ✅ Dependencies installed")

    # Check database
    print("\n🗄️  Checking Database...")
    try:
        from app.database import Base, engine
        Base.metadata.create_all(bind=engine)
        print("   ✅ Database initialized")
    except Exception as e:
        print(f"   ❌ Database error: {str(e)}")

    # Check backend imports
    print("\n🔧 Checking Backend Imports...")
    try:
        from app.main import app
        from app.database import Base, engine
        print("   ✅ All imports successful")
    except Exception as e:
        print(f"   ❌ Import error: {str(e)}")
        sys.exit(1)

    # Check backend health
    if not check_backend():
        print("\n💡 Backend is not running locally")
        print("   To start backend, run:")
        print("   cd backend")
        print("   python -m uvicorn app.main:app --reload --port 8000")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("✅ All checks passed! Backend is ready")
    print("=" * 70)
    print("\n📋 API Endpoints:")
    print("   • Health: http://localhost:8000/health")
    print("   • Docs:   http://localhost:8000/docs")
    print("   • Login:  POST http://localhost:8000/api/auth/login")
    print("\n")

if __name__ == "__main__":
    main()
