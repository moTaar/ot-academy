@echo off
rem Start CS Academy.
rem   start.bat                  run with config.json
rem   start.bat --cs-url <url>   train against the Content Server at <url>
rem   start.bat test             run the self-test (does not touch Content Server)
rem   start.bat allow-network    let other devices through Windows Firewall (once;
rem                              asks for administrator rights)
rem
rem Node.js: uses a portable copy next to this file if there is one - either a
rem folder named "node" or the extracted Windows zip ("node-v22.x.x-win-x64")
rem from https://nodejs.org - otherwise the node.exe found on PATH.
setlocal
cd /d "%~dp0"

set "NODE=node"
for /d %%D in ("%~dp0node-v*-win-x64") do if exist "%%D\node.exe" set "NODE=%%D\node.exe"
if exist "%~dp0node\node.exe" set "NODE=%~dp0node\node.exe"

"%NODE%" --version >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer was not found.
  echo Extract the Windows .zip build from https://nodejs.org into "%~dp0" or install Node.js, then run this again.
  echo If node.exe is already there, the folder path is probably too long for Windows: move the app to a short path such as C:\cs-academy.
  pause
  exit /b 1
)

if /i "%~1"=="test" goto selftest
if /i "%~1"=="allow-network" goto allownetwork
"%NODE%" server.js %*
exit /b %errorlevel%

:selftest
"%NODE%" test\smoke.js
exit /b %errorlevel%

:allownetwork
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\allow-network.ps1" -Node "%NODE%"
exit /b %errorlevel%
