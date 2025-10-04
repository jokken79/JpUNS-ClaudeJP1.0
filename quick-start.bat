@echo off
REM ===========================================
REM FactoryFlow HR - Quick Start Script (Windows)
REM ===========================================

echo ============================================
echo   FactoryFlow HR - Quick Start (Windows)
echo ============================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed.
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul

    echo.
    echo ============================================
    echo   IMPORTANT: Configure your GEMINI_API_KEY
    echo ============================================
    echo.
    echo 1. Get your API key from: https://makersuite.google.com/app/apikey
    echo 2. Edit .env file and replace 'your_gemini_api_key_here' with your actual API key
    echo.
    echo Opening .env file in notepad...
    echo.
    notepad .env
) else (
    echo [OK] .env file exists
)

REM Check if GEMINI_API_KEY is configured
findstr /C:"your_gemini_api_key_here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [ERROR] GEMINI_API_KEY is not configured in .env
    echo Please edit .env and add your API key before continuing.
    pause
    exit /b 1
)

echo.
echo Starting Docker containers...
echo.

REM Build and start containers
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start Docker containers
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo Waiting for application to start...
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   FactoryFlow HR is now running!
echo ============================================
echo.
echo Access the application at:
echo   http://localhost:9002
echo.
echo Useful commands:
echo   View logs:    docker-compose logs -f
echo   Stop:         docker-compose down
echo   Restart:      docker-compose restart
echo   Rebuild:      docker-compose up -d --build
echo.

REM Ask to open browser
set /p OPEN_BROWSER="Open browser? (y/n): "
if /i "%OPEN_BROWSER%"=="y" (
    start http://localhost:9002
)

echo.
pause
