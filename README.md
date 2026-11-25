# 🎙️ Kinetic Subtitle Studio

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express%20%2B%20Socket.io-339933)

Aplikasi web lokal **open-source** untuk membuat auto-subtitle *real-time* berbahasa Indonesia (`id-ID`) dengan animasi kinetik modern dan *overlay* transparan 100% untuk kebutuhan live streaming (OBS Studio, TikTok Live Studio, Streamlabs).

> **🌍 Proyek Open Source & Gratis:** Aplikasi ini 100% gratis dan bersifat terbuka (*open-source*). Siapa pun bebas mengunduh, menggunakan untuk kebutuhan live stream pribadi maupun komersial, serta memodifikasi atau mengembangkan kodenya lebih lanjut!

---

## ✨ Fitur Utama
- **Speech-to-Text Real-Time:** Menggunakan Web Speech API bawaan Google Chrome dengan mekanisme *auto-restart* otomatis.
- **Animasi Kinetik CSS:** Pilihan animasi *Pop & Bounce*, *Slide Up*, *Zoom Punch*, *Elastic Jelly*, dan *Sticker Box*.
- **Kustomisasi Penuh:** Atur jumlah kata per baris (1, 2, 3–4, 5–7 kata, atau paragraf), jenis font, ukuran teks, warna stabilo (*highlight*), ketebalan *outline*, dan posisi layar.
- **Auto-Clear Silence:** Menghapus teks secara otomatis saat pembicara berhenti berbicara.
- **Ringan & Lokal:** Berjalan langsung di `localhost:3000` tanpa membebani CPU maupun GPU.

---

## 🚀 Cara Menggunakan (Untuk Pengguna Baru)

### 1. Persiapan Awal (Cukup 1x)
- Pastikan **Node.js** sudah terinstal di komputer/laptop ([Unduh Node.js](https://nodejs.org/)).
- Gunakan browser **Google Chrome** atau **Microsoft Edge** (wajib untuk fitur pengenalan suara).

### 2. Menjalankan Aplikasi
1. Unduh repositori ini (**Code** → **Download ZIP**) lalu ekstrak foldernya.
2. Klik ganda file **`start.bat`**.
3. Halaman kontrol akan otomatis terbuka di Google Chrome (`http://localhost:3000/panel`). *(Biarkan jendela terminal hitam tetap terbuka selama digunakan)*.

### 3. Memasang ke OBS Studio / TikTok Live Studio
1. Di halaman Panel Kontrol, klik tombol **📋 Salin URL Overlay OBS** (`http://localhost:3000/overlay`).
2. Di OBS / TikTok Live Studio, tambahkan source baru → pilih **Browser** (atau **Link / Tautan**).
3. Tempel URL tersebut, atur ukuran sesuai resolusi kanvas (misal `1920 x 1080`), lalu klik **OK**.
4. Klik **▶ Mulai Tangkap Suara** di Chrome dan izinkan akses mikrofon!

---

## 🤝 Kontribusi & Pengembangan
Punya ide animasi baru, dukungan bahasa tambahan, atau fitur menarik lainnya? Silakan *fork* repositori ini, buat perubahanmu, dan ajukan *Pull Request*!

## 📄 Lisensi
Proyek ini dirilis di bawah lisensi **MIT** — bebas digunakan, disalin, dimodifikasi, dan dibagikan kembali kepada siapa saja.

---

## 👨‍💻 Kredit & Pembuat
* **Dibuat oleh:** @daraadesu020
* **Dikembangkan dengan bantuan:** Google Gemini