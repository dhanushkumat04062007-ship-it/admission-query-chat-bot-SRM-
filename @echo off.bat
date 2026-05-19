@echo off
TITLE SRM Query AI Launcher
echo =====================================================
echo    STARTING SRM UNIVERSITY ADMISSION AI SYSTEM
echo =====================================================
echo.

:: 1. Start Backend
echo [1/3] Starting Backend Server (Port 5000)...
cd UNIVERSITY_ADMISSION_QUERY_AI\backend
start "SRM AI Backend" cmd /k "npm start"
cd ..\..

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

:: 2. Start Frontend
echo.
echo [2/3] Starting Frontend Interface (Port 3000)...
cd UNIVERSITY_ADMISSION_QUERY_AI\frontend
start "SRM AI Frontend" cmd /k "npm run dev"
cd ..\..

echo Waiting 8 seconds for frontend compilation...
timeout /t 8 /nobreak >nul

:: 3. Open Browser
echo.
echo [3/3] Opening Application...
start http://localhost:3000

echo.
echo =====================================================
echo    SYSTEM IS LIVE at http://localhost:3000
echo =====================================================
pause
