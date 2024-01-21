@echo off
setlocal EnableDelayedExpansion

set "repositoryPath=%~dp0..\..\seyo.github.io"

if not exist "%repositoryPath%" (
    echo Repository folder does not exist.
    exit /b
)

echo Going to repository folder...
cd /d "%repositoryPath%"

echo Adding all files...
git add -A

echo Committing changes...
git commit -m "Commit from build script"

echo Pushing to GitHub...
git push

echo Script complete.