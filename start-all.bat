@echo off
REM Complete startup script for Windows
REM Run this from the project root: start-all.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting AxionX Application...
echo.

REM =============================================================================
REM BACKEND SETUP
REM =============================================================================
echo 📦 Setting up Backend...

cd backend

echo    Installing Python dependencies...
pip install -q -r requirements.txt >nul 2>&1

echo    Checking database...
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)" >nul 2>&1

echo    Validating backend imports...
python -c "from app.main import app; print('   ✅ Backend imports OK')" || (
    echo    ❌ Backend import failed!
    exit /b 1
)

echo    ✅ Backend ready
echo.

REM =============================================================================
REM FRONTEND SETUP
REM =============================================================================
echo 📦 Setting up Frontend...

cd ..\frontend

echo    Installing Node packages...
call npm install --quiet >nul 2>&1

if not exist ".env.local" (
    echo    Creating .env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ) > .env.local
    echo    ✅ .env.local created
) else (
    echo    ✅ .env.local exists
)

echo    ✅ Frontend ready
echo.

REM =============================================================================
REM START SERVERS
REM =============================================================================
echo 🎯 Starting Servers...
echo.
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
echo    Close this window to stop all servers
echo.

REM Start backend
cd ..\backend
echo    Starting Backend...
start "Backend - AxionX" python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
cd ..\frontend
echo    Starting Frontend...
start "Frontend - AxionX" cmd /k npm run dev

echo.
echo ✅ Both servers started! Check the opened windows.
echo.
pause
