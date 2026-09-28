"""
Axion Pilot - Unified Local Development Launcher
Runs both Backend and Frontend under a SINGLE unified port (http://localhost:3000).

Usage:
    python run_local.py
    OR
    npm run dev
"""

import sys
import os
import time
import subprocess
import signal
import webbrowser
import urllib.request

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

BACKEND_HOST = "127.0.0.1"
BACKEND_PORT = 8000
FRONTEND_PORT = 3000

processes = []

def cleanup(*args):
    print("\n[Axion Pilot] Shutting down services...")
    for p in processes:
        try:
            if sys.platform == "win32":
                subprocess.call(["taskkill", "/F", "/T", "/PID", str(p.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                p.terminate()
        except Exception:
            pass
    print("[Axion Pilot] All services stopped.")
    sys.exit(0)

def wait_for_service(url, name, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def main():
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("=" * 68)
    print(" 🚀 AXION PILOT - UNIFIED LOCAL DEVELOPMENT ENVIRONMENT")
    print("=" * 68)
    print(" [1/3] Launching FastAPI Backend on internal port 8000...")

    # Start Backend
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", BACKEND_HOST, "--port", str(BACKEND_PORT)],
        cwd=BACKEND_DIR,
        shell=(sys.platform == "win32")
    )
    processes.append(backend_proc)

    # Wait for backend
    if wait_for_service(f"http://{BACKEND_HOST}:{BACKEND_PORT}/health", "Backend", timeout=15):
        print("  ✓ Backend is operational (healthy).")
    else:
        print("  ⚠ Backend starting up...")

    print(" [2/3] Launching Next.js Frontend on port 3000...")
    # Start Frontend (uses rewrites to proxy /api and /docs to internal backend)
    frontend_proc = subprocess.Popen(
        "npm run dev",
        cwd=FRONTEND_DIR,
        shell=True
    )
    processes.append(frontend_proc)

    # Wait for frontend
    print(" [3/3] Establishing unified gateway on port 3000...")
    if wait_for_service(f"http://localhost:{FRONTEND_PORT}", "Frontend", timeout=25):
        print("  ✓ Frontend gateway is operational.")
    
    print("\n" + "=" * 68)
    print(" 🎉 ALL SERVICES READY ON SINGLE TESTABLE PORT:")
    print("=" * 68)
    print(f" 🌐 Web Application & Dashboard : http://localhost:{FRONTEND_PORT}")
    print(f" 📡 Backend API Gateway         : http://localhost:{FRONTEND_PORT}/api")
    print(f" 📚 Swagger API Documentation   : http://localhost:{FRONTEND_PORT}/docs")
    print(f" 💓 Health Check               : http://localhost:{FRONTEND_PORT}/health")
    print("=" * 68)
    print(" [Press Ctrl+C to stop all services]\n")

    try:
        webbrowser.open(f"http://localhost:{FRONTEND_PORT}")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
            # Check if any process died
            if backend_proc.poll() is not None:
                print("⚠ Backend process stopped.")
                break
            if frontend_proc.poll() is not None:
                print("⚠ Frontend process stopped.")
                break
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()

if __name__ == "__main__":
    main()
