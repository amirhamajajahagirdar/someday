@echo off
cd /d "%~dp0"
echo Starting Someday on all network interfaces at port 8000.
echo Use only on a trusted Private Wi-Fi network.
npm run lan
echo.
echo Someday has stopped. Press any key to close this window.
pause >nul
