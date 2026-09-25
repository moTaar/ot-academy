@echo off
rem Start CS Academy. Pass --demo to use the built-in mock Content Server.
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js 18+ is required: https://nodejs.org & pause & exit /b 1)
node server.js %*
