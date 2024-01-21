@echo off
setlocal EnableDelayedExpansion

set "sourceFolder=%~dp0..\dist"
set "destinationFolder=%~dp0..\..\seyo.github.io"

if not exist "%sourceFolder%" (
    echo Source folder does not exist.
    exit /b
)

if not exist "%destinationFolder%" (
    mkdir "%destinationFolder%"
)

echo Copying files and folders from %sourceFolder% to %destinationFolder%...

xcopy /s /e /y "%sourceFolder%\*" "%destinationFolder%"

echo Copy complete.
