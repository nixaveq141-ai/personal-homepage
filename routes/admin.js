const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../database');

// ── File upload setup ──────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── Auth middleware ──────────────────────────────────────────

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ── File upload ────────────────────────────────────────────

router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: '/uploads/' + req.file.filename });
});

// ── Login / Logout ──────────────────────────────────────────

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.getAdmin(username);
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (hash !== admin.password_hash) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.admin = { id: admin.id, username: admin.username };
  res.json({ success: true, username: admin.username });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check', requireAuth, (req, res) => {
  res.json({ username: req.session.admin.username });
});

// ── Generic CRUD factory ────────────────────────────────────

function crudRoutes(router, path, tableName) {
  // List
  router.get(`/${path}`, requireAuth, (req, res) => {
    res.json(db.all(tableName));
  });

  // Create
  router.post(`/${path}`, requireAuth, (req, res) => {
    const row = db.insert(tableName, req.body);
    res.status(201).json(row);
  });

  // Update
  router.put(`/${path}/:id`, requireAuth, (req, res) => {
    const row = db.update(tableName, parseInt(req.params.id), req.body);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  // Delete
  router.delete(`/${path}/:id`, requireAuth, (req, res) => {
    const ok = db.delete(tableName, parseInt(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
}

// ── CRUD for each content type ──────────────────────────────

crudRoutes(router, 'projects', 'projects');
crudRoutes(router, 'articles', 'articles');
crudRoutes(router, 'photos', 'photos');

// Songs with lyrics
router.get('/songs', requireAuth, (req, res) => {
  const songs = db.all('songs');
  res.json(songs);
});

router.post('/songs', requireAuth, (req, res) => {
  const { lyrics, ...songData } = req.body;
  const song = db.insert('songs', songData);
  if (lyrics) {
    db.insert('lyrics', { song_id: song.id, content: typeof lyrics === 'string' ? lyrics : JSON.stringify(lyrics) });
  }
  res.status(201).json(song);
});

router.put('/songs/:id', requireAuth, (req, res) => {
  const { lyrics, ...songData } = req.body;
  const song = db.update('songs', parseInt(req.params.id), songData);
  if (!song) return res.status(404).json({ error: 'Not found' });
  if (lyrics !== undefined) {
    const existing = db.all('lyrics').find(l => l.song_id === song.id);
    if (existing) {
      db.update('lyrics', existing.id, { content: typeof lyrics === 'string' ? lyrics : JSON.stringify(lyrics) });
    } else {
      db.insert('lyrics', { song_id: song.id, content: typeof lyrics === 'string' ? lyrics : JSON.stringify(lyrics) });
    }
  }
  res.json(song);
});

router.delete('/songs/:id', requireAuth, (req, res) => {
  const sid = parseInt(req.params.id);
  const lyrics = db.all('lyrics').find(l => l.song_id === sid);
  if (lyrics) db.delete('lyrics', lyrics.id);
  const ok = db.delete('songs', sid);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// NetEase Cloud Music parsing
router.post('/songs/parse', requireAuth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing NetEase URL or song ID' });

  try {
    const axios = require('axios');
    // Extract song ID from various URL formats
    let songId = url;
    const match = url.match(/id=(\d+)/) || url.match(/song\/(\d+)/) || url.match(/song\?id=(\d+)/);
    if (match) songId = match[1];

    // Use meting API to fetch song info (public service)
    const apiUrl = `https://api.injahow.cn/meting/?type=song&id=${songId}&server=netease`;
    const { data } = await axios.get(apiUrl, { timeout: 10000 });
    if (!data || !data.length) return res.status(404).json({ error: 'Song not found on NetEase' });

    const song = data[0];

    // Fetch HD cover: resolve meting redirect and upgrade to 500×500
    let cover = song.pic || song.cover || '';
    try {
      const picId = cover.match(/id=(\d+)/)?.[1];
      if (picId) {
        const picRes = await axios.get(
          `https://api.injahow.cn/meting/?server=netease&type=pic&id=${picId}`,
          { timeout: 10000, maxRedirects: 0, validateStatus: s => s === 302,
            headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        const redirectUrl = picRes.headers.location;
        if (redirectUrl && redirectUrl.includes('music.126.net')) {
          cover = redirectUrl.replace(/param=\d+y\d+/, 'param=500y500');
        }
      }
    } catch { /* keep meting proxy URL as fallback */ }

    // Fetch lyrics
    const lyricUrl = `https://api.injahow.cn/meting/?type=lrc&id=${songId}&server=netease`;
    let lyrics = [];
    try {
      const lyricRes = await axios.get(lyricUrl, { timeout: 10000 });
      const raw = lyricRes.data;
      if (typeof raw === 'string' && raw.trim()) {
        lyrics = parseLrc(raw);
      } else if (raw && typeof raw === 'object' && raw.lyric) {
        lyrics = parseLrc(raw.lyric);
      }
    } catch { /* no lyrics */ }

    res.json({
      title: song.name || song.title,
      artist: song.artist || song.author,
      netease_id: String(songId),
      audio_url: song.url || '',
      cover_url: cover,
      duration: song.duration || 0,
      lyrics
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to parse song: ' + e.message });
  }
});

function parseLrc(lrcText) {
  const lines = lrcText.split('\n');
  const result = [];
  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      let ms = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3)) : 0;
      const time = min * 60 + sec + ms / 1000;
      const text = match[4].trim();
      if (text) result.push({ time, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

crudRoutes(router, 'moments', 'moments');

// ── Config ──────────────────────────────────────────────────

router.put('/config', requireAuth, (req, res) => {
  const updates = req.body;
  Object.entries(updates).forEach(([k, v]) => db.setConfig(k, String(v)));
  res.json({ success: true });
});

// ── Comments management ─────────────────────────────────────

router.get('/comments', requireAuth, (req, res) => {
  res.json(db.all('comments').sort((a, b) => b.id - a.id));
});

router.post('/comments', requireAuth, (req, res) => {
  const { section, content } = req.body;
  if (!section || !content || !content.trim()) {
    return res.status(400).json({ error: 'Missing section or content' });
  }
  const comment = db.insert('comments', {
    section,
    github_username: 'Puearill',
    github_avatar: '/assets/avatar.png',
    content: content.trim(),
    is_admin: 1
  });
  res.status(201).json(comment);
});

router.delete('/comments/:id', requireAuth, (req, res) => {
  const ok = db.delete('comments', parseInt(req.params.id));
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// ── Moment comments management ──────────────────────────────

router.get('/moment-comments', requireAuth, (req, res) => {
  const comments = db.all('moment_comments').sort((a, b) => b.id - a.id);
  res.json(comments);
});

router.post('/moment-comments/:id/reply', requireAuth, (req, res) => {
  const parent = db.all('moment_comments').find(c => c.id === parseInt(req.params.id));
  if (!parent) return res.status(404).json({ error: 'Comment not found' });
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Missing content' });
  const reply = db.addMomentComment(
    parent.moment_id, parent.id,
    'Puearill', '/assets/avatar.png', content, true
  );
  res.status(201).json(reply);
});

// Admin reply directly to a moment (top-level comment)
router.post('/moment-comments', requireAuth, (req, res) => {
  const { moment_id, content } = req.body;
  if (!moment_id || !content || !content.trim()) {
    return res.status(400).json({ error: 'Missing moment_id or content' });
  }
  const comment = db.addMomentComment(
    parseInt(moment_id), null,
    'Puearill', '/assets/avatar.png', content, true
  );
  res.status(201).json(comment);
});

router.delete('/moment-comments/:id', requireAuth, (req, res) => {
  const ok = db.deleteMomentComment(parseInt(req.params.id));
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;
