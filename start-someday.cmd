@echo off
cd /d "%~dp0"
echo Starting Someday on http://127.0.0.1:8000
npm start
echo.
echo Someday has stopped. Press any key to close this window.
pause >nul
