@echo off
echo 🚀 Setting up Firebase v9+ for AgriAid
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js not found!
    echo Please install Node.js first:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Navigate to frontend directory
cd frontend

REM Install Firebase
echo 📦 Installing Firebase...
npm install firebase

if %errorlevel% equ 0 (
    echo.
    echo ✅ Firebase installed successfully!
    echo.
    echo 🎉 Setup complete! You can now use the Firebase v9+ syntax.
    echo.
    echo Next steps:
    echo 1. Run: deploy.bat (to deploy Firestore rules)
    echo 2. Start server: start-server.bat
    echo 3. Test: http://localhost:8000/test.html
) else (
    echo.
    echo ❌ Firebase installation failed!
    echo Please check your internet connection and try again.
)

echo.
pause
