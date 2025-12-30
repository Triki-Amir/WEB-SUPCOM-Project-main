@echo off
echo ================================================
echo   REDEMARRAGE COMPLET DU BACKEND
echo ================================================
echo.

echo [1/3] Arret du backend en cours...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5000') DO (
    echo   Processus trouve: %%P
    taskkill /PID %%P /F 2>nul
)

echo.
echo [2/3] Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Demarrage du backend...
cd /d "%~dp0"
npm run dev
