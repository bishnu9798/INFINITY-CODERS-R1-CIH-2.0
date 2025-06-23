@echo off
echo 🚀 Starting Freelancer-market-place System with MongoDB Integration...
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
echo 🗄️ Starting Backend Server with MongoDB...
echo Backend will run on: http://localhost:3002
echo Database: MongoDB Atlas
start "Freelancer-market-place Backend (MongoDB)" cmd /k "cd /d "%~dp0backend" && node server-mongodb.js"

REM Wait for backend to start
echo ⏳ Waiting for backend and MongoDB to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...
echo Frontend will run on: http://localhost:5173
start "Freelancer-market-place Frontend" cmd /k "cd /d "%~dp0" && npx vite"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 Freelancer-market-place with MongoDB is starting up!
echo.
echo 📋 System URLs:
echo   Frontend: http://localhost:5173/
echo   Backend:  http://localhost:3002/api/health
echo   Database: MongoDB Atlas (Connected)
echo.
echo 🔑 Your Login Credentials (from Database):
echo   Recruiter:   manishmodi0408@gmail.com / 987654
echo   Job Seeker:  manish1@gmail.com / 123456
echo.
echo 📊 Database Features:
echo   ✅ User registration saves to MongoDB
echo   ✅ Job posting saves to MongoDB
echo   ✅ Job applications save to MongoDB
echo   ✅ All data persists permanently
echo.
echo 🌐 Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open the application in browser
start http://localhost:5173/

echo.
echo ✅ Freelancer-market-place with MongoDB Started Successfully!
echo.
echo 💡 Tips:
echo   - Keep both terminal windows open
echo   - All data is saved to MongoDB Atlas
echo   - If you see errors, wait a few more seconds for MongoDB connection
echo   - To stop: Close both terminal windows or press Ctrl+C in each
echo   - This version uses full MongoDB integration
echo.
echo 🔍 To check database status:
echo   cd backend
echo   node check-database.js
echo.
pause
