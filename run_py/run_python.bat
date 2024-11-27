@echo off
REM Ensure the python executable and script paths are quoted

if "%1"=="1" (
    python "C:\Users\Poseidon\Desktop\Mr_Keyword\python child\hello.py" 1
) else if "%1"=="2" (
    python "C:\Users\Poseidon\Desktop\Mr_Keyword\python child\hello.py" 2
) else (
    echo Invalid argument
    exit /b 1
)
