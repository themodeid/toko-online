@echo off
REM MongoDB Installation Script for Windows
REM Download and install MongoDB Community Edition

echo ==========================================
echo MongoDB Installer for Windows
echo ==========================================
echo.
echo Downloading MongoDB Community Edition...
echo.

REM Create temp directory
if not exist "%temp%\mongodb-install" mkdir "%temp%\mongodb-install"

REM Download using PowerShell
powershell -Command "(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi', '%temp%\mongodb-install\mongodb.msi')"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to download MongoDB
    echo Please visit: https://www.mongodb.com/try/download/community
    echo Download the Windows MSI file and run it manually
    pause
    exit /b 1
)

echo.
echo Installing MongoDB...
echo.

REM Install MongoDB
msiexec.exe /i "%temp%\mongodb-install\mongodb.msi" /qn INSTALLDIR="C:\Program Files\MongoDB\Server\7.0" ADDLOCAL="all"

echo.
echo Installation complete!
echo.
echo Cleaning up...
del /q "%temp%\mongodb-install\mongodb.msi"

echo.
echo ==========================================
echo.
echo ✅ MongoDB has been installed!
echo.
echo To start MongoDB as a service:
echo   net start MongoDB
echo.
echo To verify installation, open new terminal and run:
echo   mongosh
echo.
echo Then run your backend: npm run dev
echo ==========================================
pause
