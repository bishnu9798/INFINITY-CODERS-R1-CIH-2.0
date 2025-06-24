@echo off
echo 🚀 Starting Infinity Workspace System...
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
echo 🗄️ Starting Backend Server...
echo Backend will run on: http://localhost:3002
start "Infinity Workspace Backend" cmd /k "cd /d "%~dp0backend" && npm start"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...
echo Frontend will run on: http://localhost:5173 (or next available port)
start "Infinity Workspace Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 Infinity Workspace is starting up!
echo.
echo 📋 System URLs:
echo   Frontend: http://localhost:5173/ (check terminal for actual port)
echo   Backend:  http://localhost:3002/api/health
echo   Database: MongoDB Atlas (Shared Development)
echo.
echo 🔑 Shared Development Environment:
echo   - All developers use the same database
echo   - Real-time collaboration enabled
echo   - See services and applications from other developers
echo.
echo 🌐 Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open the application in browser
start http://localhost:5173/

echo.
echo ✅ Infinity Workspace Started Successfully!
echo.
echo 💡 Tips:
echo   - Keep both terminal windows open
echo   - If frontend port 5173 is busy, check the frontend terminal for actual port
echo   - All data is shared with other developers in real-time
echo   - To stop: Close both terminal windows or press Ctrl+C in each
echo.
echo 🔍 If you see "Network error":
echo   1. Wait 10-15 seconds for servers to fully start
echo   2. Check backend terminal for "Ready to receive requests!"
echo   3. Refresh your browser
echo   4. Check if ports 3002 and 5173 are available
echo.
pause
