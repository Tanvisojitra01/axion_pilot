@echo off
REM Simple frontend startup for Windows

cd frontend

echo Installing dependencies...
call npm install --quiet >nul 2>&1

echo.
echo 🚀 Starting Frontend Server...
echo.
echo Frontend URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev

pause
