@echo off
echo ========================================
echo   EduVise - Gelistirme Ortami Baslatici
echo ========================================
echo.

echo [1/2] Backend baslatiliyor (http://localhost:8000)...
start "EduVise Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe run.py"

timeout /t 3 /nobreak >nul

echo [2/2] Frontend baslatiliyor (http://localhost:5173)...
start "EduVise Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   Her iki servis baslatildi!
echo   Backend : http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo ========================================
pause
