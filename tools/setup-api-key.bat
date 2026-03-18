@echo off
REM Setup script for Anthropic API key
REM Usage: setup-api-key.bat YOUR_API_KEY_HERE

if "%1"=="" (
    echo Usage: setup-api-key.bat YOUR_API_KEY_HERE
    echo.
    echo This will set your Anthropic API key as an environment variable.
    exit /b 1
)

setx ANTHROPIC_API_KEY "%1"
echo.
echo API key configured successfully.
echo Restart PowerShell/cmd for changes to take effect.
pause
