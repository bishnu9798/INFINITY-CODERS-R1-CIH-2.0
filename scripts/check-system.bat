@echo off
echo 🔍 Freelancer-market-place System Health Check
echo.

REM Check Node.js
echo 1️⃣ Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.

REM Check if ports are in use
echo 2️⃣ Checking ports...
netstat -an | findstr :3002 >nul 2>&1
if errorlevel 1 (
    echo ❌ Port 3002 (Backend) is not in use
) else (
    echo ✅ Port 3002 (Backend) is in use
)

netstat -an | findstr :5173 >nul 2>&1
if errorlevel 1 (
    echo ❌ Port 5173 (Frontend) is not in use
) else (
    echo ✅ Port 5173 (Frontend) is in use
)

echo.

REM Test backend connection
echo 3️⃣ Testing backend connection...
curl -s http://localhost:3002/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend not responding
) else (
    echo ✅ Backend is responding
)

echo.

REM Test frontend connection
echo 4️⃣ Testing frontend connection...
curl -s http://localhost:5173/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend not responding
) else (
    echo ✅ Frontend is responding
)

echo.

REM Check MongoDB connection (by testing backend API)
echo 5️⃣ Testing database connection...
curl -s "http://localhost:3002/api/jobs" >nul 2>&1
if errorlevel 1 (
    echo ❌ Database connection failed
) else (
    echo ✅ Database connection working
)

echo.
echo 📋 System Status Summary:
echo   Frontend: http://localhost:5173/
echo   Backend:  http://localhost:3002/
echo   Health:   http://localhost:3002/api/health
echo.
echo 🔑 Login Credentials:
echo   Recruiter:   manishmodi0408@gmail.com / 987654
echo   Job Seeker:  manish1@gmail.com / 123456
echo.
pause
