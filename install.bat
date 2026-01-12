@echo off
echo ====================================
echo   GigFlow - Installation Script
echo ====================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)
echo Backend dependencies installed successfully!
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies installed successfully!
echo.

echo [3/3] Setup Complete!
echo.
echo ====================================
echo Installation completed successfully!
echo ====================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run 'start-dev.bat' to start both servers
echo.
pause
