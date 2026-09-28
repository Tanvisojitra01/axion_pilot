@echo off
REM Simple backend startup for Windows

cd backend

echo Installing dependencies...
pip install -q -r requirements.txt >nul 2>&1

echo.
echo 🚀 Starting Backend Server...
echo.
echo Backend URL: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
