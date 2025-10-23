@echo off
echo 🚀 Deploying Fresh Firebase Backend
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

REM Deploy Firestore rules
echo 📋 Deploying Firestore rules...
firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo.
    echo ✅ Firestore rules deployed successfully!
    echo.
    echo 🎉 Fresh Firebase backend is ready!
    echo.
    echo You can now test the signup and login functionality.
) else (
    echo.
    echo ❌ Deployment failed!
    echo Please check your Firebase configuration.
)

echo.
pause
