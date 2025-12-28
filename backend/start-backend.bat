@echo off
echo Stopping any existing Node processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo Starting backend server...
cd /d "%~dp0"
npm run dev
