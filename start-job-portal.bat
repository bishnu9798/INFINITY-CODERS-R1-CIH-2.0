@echo off
echo 🚀 Starting Job Portal System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available

REM Kill any existing node processes to avoid port conflicts
echo 🔄 Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment for processes to close
timeout /t 2 /nobreak >nul

echo.
echo 🔧 Starting Backend Server...
echo Backend will run on: http://localhost:3002
start "Job Portal Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...
echo Frontend will run on: http://localhost:5173
start "Job Portal Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 Job Portal is starting up!
echo.
echo 📋 System URLs:
echo   Frontend: http://localhost:5173/
echo   Backend:  http://localhost:3002/api/health
echo.
echo 🔑 Your Login Credentials:
echo   Recruiter:   manishmodi0408@gmail.com / 987654
echo   Job Seeker:  manish1@gmail.com / 123456
echo.
echo 🌐 Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open the application in browser
start http://localhost:5173/

echo.
echo ✅ Job Portal Started Successfully!
echo.
echo 💡 Tips:
echo   - Keep both terminal windows open
echo   - If you see errors, wait a few more seconds
echo   - To stop: Close both terminal windows or press Ctrl+C in each
echo.
pause
