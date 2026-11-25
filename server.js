const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Menyajikan file statis di folder public
app.use(express.static(path.join(__dirname, 'public')));

// Routing halaman panel kontrol dan overlay OBS
app.get('/', (req, res) => res.redirect('/panel'));
app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});
app.get('/overlay', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'overlay.html'));
});

// Sinkronisasi real-time via Socket.io
io.on('connection', (socket) => {
  console.log('Klien terhubung:', socket.id);

  // Meneruskan teks subtitle dari panel ke overlay
  socket.on('subtitle:update', (data) => {
    io.emit('subtitle:render', data);
  });

  // Meneruskan perubahan style/pengaturan ke overlay
  socket.on('style:update', (styles) => {
    io.emit('style:apply', styles);
  });

  // Menghapus layar overlay saat silence / clear
  socket.on('subtitle:clear', () => {
    io.emit('subtitle:clear');
  });

  socket.on('disconnect', () => {
    console.log('Klien terputus:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Kinetic Subtitle Studio berjalan di http://localhost:${PORT}/panel`);
});