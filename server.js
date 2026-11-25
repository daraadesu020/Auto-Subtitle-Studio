'use strict';

/**
 * Kinetic Subtitle Studio — server
 * --------------------------------
 *  GET /          -> redirect ke /panel
 *  GET /panel     -> dashboard kontrol (buka di Chrome / Edge)
 *  GET /overlay   -> layar transparan untuk Browser Source OBS / TikTok Live Studio
 *
 * Socket.io (role dikirim lewat handshake query):
 *  panel   -> server : settings:update | subtitle:text | subtitle:clear
 *  server  -> overlay: settings:update | subtitle:text | subtitle:clear
 *  server  -> panel  : overlay:count
 */

const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

/* ------------------------------------------------------------------ */
/*  Validasi pengaturan (server adalah satu-satunya sumber kebenaran)  */
/* ------------------------------------------------------------------ */

const ROLES = ['panel', 'overlay', 'preview'];

const OPTIONS = {
  mode: ['w1', 'w2', 'w34', 'para'],
  animation: ['pop', 'slide', 'zoom', 'jelly', 'sticker'],
  font: ['Montserrat', 'Poppins', 'Anton', 'Bangers', 'Rubik'],
  highlightStyle: ['color', 'marker'],
  alignH: ['left', 'center', 'right'],
  alignV: ['top', 'middle', 'bottom'],
};

const DEFAULT_SETTINGS = {
  mode: 'w2',
  animation: 'pop',
  font: 'Montserrat',
  size: 96,
  color: '#ffffff',
  highlight: '#ffe600',
  highlightStyle: 'color',
  outline: 8,
  outlineColor: '#000000',
  caps: true,
  alignH: 'center',
  alignV: 'bottom',
  silence: 2,
};

const clampNum = (v, min, max, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const hexColor = (v, fallback) =>
  typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fallback;

function sanitizeSettings(input) {
  const s = input && typeof input === 'object' ? input : {};
  const out = {};
  for (const [key, allowed] of Object.entries(OPTIONS)) {
    out[key] = allowed.includes(s[key]) ? s[key] : DEFAULT_SETTINGS[key];
  }
  out.size = clampNum(s.size, 24, 260, DEFAULT_SETTINGS.size);
  out.outline = clampNum(s.outline, 0, 20, DEFAULT_SETTINGS.outline);
  out.silence = clampNum(s.silence, 0.5, 5, DEFAULT_SETTINGS.silence);
  out.color = hexColor(s.color, DEFAULT_SETTINGS.color);
  out.highlight = hexColor(s.highlight, DEFAULT_SETTINGS.highlight);
  out.outlineColor = hexColor(s.outlineColor, DEFAULT_SETTINGS.outlineColor);
  out.caps = typeof s.caps === 'boolean' ? s.caps : DEFAULT_SETTINGS.caps;
  return out;
}

const cleanText = (v) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, 4000) : '';

/* ------------------------------------------------------------------ */
/*  Express                                                            */
/* ------------------------------------------------------------------ */

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 10000,
  pingTimeout: 10000,
  maxHttpBufferSize: 1e5,
});

app.disable('x-powered-by');

// Tanpa cache, supaya OBS selalu memuat versi terbaru saat "Refresh".
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.static(PUBLIC_DIR, { index: false }));

app.get('/', (_req, res) => res.redirect('/panel'));
app.get('/panel', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'panel.html')));
app.get('/overlay', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'overlay.html')));

/* ------------------------------------------------------------------ */
/*  Socket.io                                                          */
/* ------------------------------------------------------------------ */

// State terakhir disimpan agar overlay yang baru dibuka / di-refresh
// langsung tampil dengan gaya dan teks yang benar.
const state = { settings: { ...DEFAULT_SETTINGS }, text: '' };

const roomSize = (room) => io.sockets.adapter.rooms.get(room)?.size || 0;
const viewers = () => io.to('overlay').to('preview');
const notifyOverlayCount = () => io.to('panel').emit('overlay:count', roomSize('overlay'));

io.on('connection', (socket) => {
  const requested = socket.handshake.query.role;
  const role = ROLES.includes(requested) ? requested : 'overlay';
  socket.join(role);

  if (role === 'panel') {
    socket.emit('overlay:count', roomSize('overlay'));

    socket.on('settings:update', (payload) => {
      state.settings = sanitizeSettings(payload);
      viewers().emit('settings:update', state.settings);
    });

    socket.on('subtitle:text', (payload) => {
      const text = cleanText(payload && payload.text);
      if (!text) return;
      state.text = text;
      viewers().emit('subtitle:text', { text });
    });

    socket.on('subtitle:clear', () => {
      state.text = '';
      viewers().emit('subtitle:clear');
    });
  } else {
    socket.emit('settings:update', state.settings);
    if (state.text) socket.emit('subtitle:text', { text: state.text });
    if (role === 'overlay') notifyOverlayCount();
  }

  socket.on('disconnect', () => {
    if (role === 'overlay') notifyOverlayCount();
  });
});

/* ------------------------------------------------------------------ */
/*  Start                                                              */
/* ------------------------------------------------------------------ */

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} sudah dipakai aplikasi lain.`);
    console.error(`Tutup aplikasi tersebut, atau jalankan dengan port lain:  PORT=3001 npm start\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log('\n  Kinetic Subtitle Studio berjalan\n');
  console.log(`  Panel   : http://localhost:${PORT}/panel   (buka di Chrome / Edge)`);
  console.log(`  Overlay : http://localhost:${PORT}/overlay (Browser Source OBS / TikTok Live Studio)\n`);
});
