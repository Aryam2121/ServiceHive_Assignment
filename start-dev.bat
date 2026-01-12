@echo off
echo ====================================
echo   GigFlow - Starting Development Servers
echo ====================================
echo.

echo Starting Backend Server...
start "GigFlow Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "GigFlow Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo Both servers are starting...
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
