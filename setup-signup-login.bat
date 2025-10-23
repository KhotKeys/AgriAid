@echo off
echo 🚀 Setting up Signup and Login Only
echo ====================================

REM Check if Firebase CLI is available
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Firebase CLI not found!
    echo Please install it first:
    echo npm install -g firebase-tools
    echo.
    echo Then run: firebase login
    echo.
    pause
    exit /b 1
)

echo ✅ Firebase CLI found
echo.

REM Set Firebase project
echo 📋 Setting Firebase project...
firebase use agriaid-6ad0b

REM Deploy Firestore rules
echo 📋 Deploying Firestore rules...
firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo.
    echo ✅ Setup complete!
    echo.
    echo 🎉 Signup and Login are now ready!
    echo.
    echo Test pages:
    echo - Signup: http://localhost:8000/signup-simple.html
    echo - Login:  http://localhost:8000/login-simple.html
    echo.
    echo Start your server with: start-server.bat
) else (
    echo.
    echo ❌ Setup failed!
    echo Please check your Firebase configuration.
)

echo.
pause
