@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PYTHON_CMD=python"
set "LAUNCHER_LOG=%SCRIPT_DIR%NativeHostClicker.launcher.log"
set "STDERR_LOG=%SCRIPT_DIR%NativeHostClicker.stderr.log"

>> "%LAUNCHER_LOG%" echo [%DATE% %TIME%] launcher starting

where python >NUL 2>NUL
if errorlevel 1 (
  set "PYTHON_CMD=py"
)

>> "%LAUNCHER_LOG%" echo [%DATE% %TIME%] using %PYTHON_CMD% -u "%SCRIPT_DIR%NativeHostClicker.py"
%PYTHON_CMD% -u "%SCRIPT_DIR%NativeHostClicker.py" 2>> "%STDERR_LOG%"
>> "%LAUNCHER_LOG%" echo [%DATE% %TIME%] python exited with %ERRORLEVEL%
