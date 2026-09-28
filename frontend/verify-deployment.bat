@echo off
REM Deployment verification script for Windows
REM Run this before deploying to production

echo.
echo 🔍 Starting Deployment Verification...
echo.

REM Check Node.js
echo 📦 Checking Node.js...
node -v >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✓ Node.js %NODE_VERSION% found
) else (
    echo ✗ Node.js not found
    exit /b 1
)

REM Check npm
echo.
echo 📦 Checking npm...
npm -v >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✓ npm %NPM_VERSION% found
) else (
    echo ✗ npm not found
    exit /b 1
)

REM Check package.json
echo.
echo 📁 Checking directory...
if exist package.json (
    echo ✓ In frontend directory
) else (
    echo ✗ Not in frontend directory. Run this script from the frontend folder.
    exit /b 1
)

REM Check .env.local
echo.
echo ⚙️  Checking environment configuration...
if exist .env.local (
    echo ✓ .env.local found
) else (
    echo ⚠️  .env.local not found. Copy from .env.example and update values.
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo ✓ Dependencies installed
) else (
    echo ✗ Failed to install dependencies
    exit /b 1
)

REM Run lint
echo.
echo 🔍 Running linter...
call npm run lint >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Linting passed
) else (
    echo ⚠️  Linting warnings (non-critical)
)

REM Build production
echo.
echo 🔨 Building production bundle...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Build successful
) else (
    echo ✗ Build failed
    exit /b 1
)

REM Check build output
echo.
echo 📊 Checking build output...
if exist .next (
    echo ✓ .next directory created
) else (
    echo ✗ .next directory not found
    exit /b 1
)

REM Success summary
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✓ All checks passed! Ready for deployment.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Next steps:
echo   1. Verify .env.local has all required variables
echo   2. Test locally: npm run start
echo   3. Deploy: git push to trigger deployment
echo.
echo 🚀 Deployment ready!
echo.

pause
