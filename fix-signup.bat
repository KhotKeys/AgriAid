@echo off
echo 🔧 Fixing Signup Form - No More Refresh!
echo ========================================

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
    echo 🎉 Signup form should now work without refreshing!
    echo.
    echo Test the fixed signup page:
    echo http://localhost:8000/signup-fixed.html
    echo.
    echo Or use the main signup page:
    echo http://localhost:8000/signup.html
) else (
    echo.
    echo ❌ Deployment failed!
    echo Please check your Firebase configuration.
)

echo.
pause
