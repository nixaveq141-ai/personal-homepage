require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// ── Middleware ──────────────────────────────────────────────

// Trust reverse proxy (nginx) for HTTPS
if (isProduction) app.set('trust proxy', 1);

// Admin subdomain redirect — must be before static middleware
app.use((req, res, next) => {
  if (req.hostname === 'admin.puearill.top' && req.path === '/') {
    return res.redirect('/admin-login.html');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// ── GitHub OAuth proxy endpoint ────────────────────────────

app.post('/api/auth/github', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    const axios = require('axios');
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );
    const params = new URLSearchParams(tokenRes.data);
    const access_token = params.get('access_token');
    if (!access_token) return res.status(400).json({ error: 'GitHub auth failed' });

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    res.json({ access_token, user: { login: userRes.data.login, avatar_url: userRes.data.avatar_url } });
  } catch (e) {
    res.status(500).json({ error: 'OAuth error' });
  }
});

// ── Routes ──────────────────────────────────────────────────

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// SPA fallback — serve index.html for all non-API routes (main site only)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
    return res.status(404).json({ error: 'Not found' });
  }
  // Only fallback to index.html on main domain, not admin subdomain
  if (req.hostname === 'admin.puearill.top') {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ───────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin-login.html`);
});
