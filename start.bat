@echo off
title Kinetic Subtitle Studio
echo ===================================================
echo   Memulai Kinetic Subtitle Studio...
echo ===================================================
echo.

if not exist "node_modules\" (
    echo [1/2] Menginstal library yang dibutuhkan pertama kali...
    call npm install
    echo.
)

echo [2/2] Membuka Panel Kontrol di Google Chrome...
start "" "http://localhost:3000/panel"

echo Server berjalan! JANGAN TUTUP jendela hitam ini selama live stream.
node server.js
pause