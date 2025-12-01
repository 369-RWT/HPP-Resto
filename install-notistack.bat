@echo off
REM Batch script to install notistack - Run this in Command Prompt
echo ========================================
echo Installing notistack for CostFlow
echo ========================================
echo.

cd /d "C:\Users\M S I\BM cost\HPP-Resto\frontend"

echo Current directory: %CD%
echo.
echo Installing package...
echo.

npm install notistack

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo Installation successful!
    echo.
    echo Verifying installation...
    npm list notistack
) else (
    echo Installation failed!
    echo Please check the error message above.
)
echo ========================================
echo.
pause
