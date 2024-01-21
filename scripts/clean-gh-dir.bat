@echo off
setlocal EnableDelayedExpansion

set "targetFolder=%~dp0..\..\seyo.github.io"

echo %targetFolder%

if not exist "%targetFolder%" (
    echo Folder does not exist.
    exit /b
)

echo Removing visible files and folders from %targetFolder%...

for /f "delims=" %%i in ('dir /b /a-d /a-h "%targetFolder%"') do (
    echo Deleting file: %%i
    del /q "%targetFolder%\%%i"
)

for /f "delims=" %%i in ('dir /b /ad-h "%targetFolder%"') do (
    echo Deleting folder: %%i
    rmdir /s /q "%targetFolder%\%%i"
)

echo Cleanup complete.
