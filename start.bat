@echo off
title Auto Subtitle Studio (Claude Edition)
echo ==========================================
echo   Auto Subtitle Studio - Claude Edition
echo ==========================================
echo.

if not exist "node_modules\" (
    echo [1/2] Menginstal dependensi pertama kali...
    call npm install
)

echo [2/2] Menjalankan server lokal...
start http://localhost:3000/panel
node server.js
pause