@echo off
echo 🛑 Stopping Infinity Workspace System...
echo.

REM Kill all node processes
echo 🔄 Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1

REM Kill any processes using our ports
echo 🔄 Freeing up ports 3002 and 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5175') do taskkill /f /pid %%a >nul 2>&1

echo.
echo ✅ Infinity Workspace Stopped Successfully!
echo.
echo 💡 To start again, run: start-infinity-workspace.bat
echo.
pause
