@echo off
echo Starting AgriAid Development Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found. Please install Python 3.x
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Python found. Starting HTTP server...
echo.
echo Server will be available at: http://localhost:8000
echo.
echo Test Firebase integration at: http://localhost:8000/firebase-test.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start HTTP server in the frontend directory
cd frontend
python -m http.server 8000
