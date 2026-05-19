@echo off
TITLE SRM Query AI Robust Launcher
color 0B

echo =====================================================
echo    ROBUST STARTUP: SRM UNIVERSITY ADMISSION AI
echo =====================================================
echo.

:: Switch to the exact directory where this batch file is located
:: This prevents the "cannot find path" errors no matter where you click it from!
cd /d "%~dp0"

:: 1. Start Ollama
echo [1/3] Starting Ollama AI Engine...
:: We use start /MIN to open it minimized so it doesn't clutter your screen
start "Ollama AI" /MIN cmd /c "ollama serve"
echo Waiting 5 seconds for Ollama to spin up...
timeout /t 5 /nobreak >nul
echo.

:: 2. Start Backend
echo [2/3] Starting Backend Server (Node.js)...
cd backend
:: Starts the backend in its own window
start "SRM AI Backend" cmd /k "npm start"
cd ..
echo Waiting 5 seconds for the database and backend to connect...
timeout /t 5 /nobreak >nul
echo.

:: 3. Start Frontend
echo [3/3] Starting Frontend Interface (Next.js/React)...
cd frontend
start "SRM AI Frontend" cmd /k "npm run dev"
cd ..
echo Waiting 8 seconds for frontend compilation to finish...
timeout /t 8 /nobreak >nul
echo.

:: 4. Open Application
echo Opening Browser...
start http://localhost:3000

echo.
echo =====================================================
echo    SYSTEM IS FULLY LIVE AND CONNECTED!
echo    - Ollama Engine: Running (API Ready)
echo    - Backend: Running on Port 5000
echo    - Frontend: Running on Port 3000
echo =====================================================
echo You can safely close THIS window, but leave the other command prompts running!
pause
