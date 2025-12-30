@echo off
echo Arrêt du backend...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5000') DO taskkill /PID %%P /F 2>nul

timeout /t 2 /nobreak >nul

echo Démarrage du backend...
cd /d "%~dp0"
npm run dev
