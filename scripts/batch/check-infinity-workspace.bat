@echo off
echo 🔍 Checking Infinity Workspace System Health...
echo.

REM Check if Node.js is installed
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo 📋 Checking if ports are in use...

REM Check port 3002 (Backend)
netstat -an | findstr :3002 >nul 2>&1
if errorlevel 1 (
    echo ❌ Port 3002 (Backend) is not in use - Backend may not be running
) else (
    echo ✅ Port 3002 (Backend) is in use
)

REM Check port 5173 (Frontend)
netstat -an | findstr :5173 >nul 2>&1
if errorlevel 1 (
    echo ❌ Port 5173 (Frontend) is not in use - Frontend may not be running
) else (
    echo ✅ Port 5173 (Frontend) is in use
)

echo.
echo 📋 Checking backend health...
curl -s http://localhost:3002/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend health check failed
    echo   Backend may not be running or not responding
) else (
    echo ✅ Backend is responding
    echo   Response:
    curl -s http://localhost:3002/api/health
)

echo.
echo 📋 Checking frontend...
curl -s http://localhost:5173/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is not responding on port 5173
    echo   Check if frontend is running on a different port
) else (
    echo ✅ Frontend is responding on port 5173
)

echo.
echo 📋 System Status Summary:
echo   Backend URL: http://localhost:3002/api/health
echo   Frontend URL: http://localhost:5173/
echo   Database: MongoDB Atlas (Shared)
echo.
echo 💡 If you see issues:
echo   1. Run: stop-infinity-workspace.bat
echo   2. Wait 5 seconds
echo   3. Run: start-infinity-workspace.bat
echo   4. Wait 15 seconds for full startup
echo.
pause
