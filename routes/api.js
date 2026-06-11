const express = require('express');
const router = express.Router();
const db = require('../database');

// Disable caching for all API responses
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ── Helper: verify GitHub token ─────────────────────────────

async function verifyGitHubUser(token) {
  if (!token) return null;
  try {
    const axios = require('axios');
    const res = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { login: res.data.login, avatar_url: res.data.avatar_url };
  } catch {
    return null;
  }
}

// ── Projects ────────────────────────────────────────────────

router.get('/projects', (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  let items = db.all('projects').sort((a, b) => b.id - a.id);
  if (limit > 0) items = items.slice(0, limit);
  items = items.map(p => ({ ...p, tags: safeJson(p.tags) }));
  res.json(items);
});

// ── Articles ────────────────────────────────────────────────

router.get('/articles', (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  let items = db.all('articles').sort((a, b) => b.id - a.id);
  if (limit > 0) items = items.slice(0, limit);
  items = items.map(a => ({ ...a, tags: safeJson(a.tags) }));
  res.json(items);
});

// ── Photos ──────────────────────────────────────────────────

router.get('/photos', (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  let items = db.all('photos').sort((a, b) => b.id - a.id);
  if (limit > 0) items = items.slice(0, limit);
  res.json(items);
});

// ── Songs & Lyrics ──────────────────────────────────────────

router.get('/songs', (req, res) => {
  const items = db.all('songs').sort((a, b) => a.sort_order - b.sort_order);
  res.json(items);
});

router.get('/songs/:id/lyrics', (req, res) => {
  const lyrics = db.all('lyrics').find(l => l.song_id === parseInt(req.params.id));
  if (!lyrics) return res.json([]);
  try {
    res.json(JSON.parse(lyrics.content));
  } catch {
    res.json([{ time: 0, text: lyrics.content }]);
  }
});

// ── Moments (说说) ──────────────────────────────────────────

router.get('/moments', (req, res) => {
  const items = db.all('moments').sort((a, b) => b.id - a.id);
  res.json(items);
});

// ── Stats ───────────────────────────────────────────────────

router.get('/stats', (req, res) => {
  res.json({
    projects: db.count('projects'),
    articles: db.count('articles'),
    photos: db.count('photos')
  });
});

// ── Search ──────────────────────────────────────────────────

router.get('/search', (req, res) => {
  const { q, section } = req.query;
  if (!q || !q.trim()) return res.json({ projects: [], articles: [], photos: [], moments: [], songs: [] });

  if (section) {
    // Section-scoped search
    const fields = {
      projects: ['title', 'description', 'tags'],
      articles: ['title', 'summary', 'content', 'tags'],
      photos: ['title', 'description'],
      moments: ['content'],
      songs: ['title', 'artist']
    };
    if (!fields[section]) return res.status(400).json({ error: 'Invalid section' });
    const results = db.search(section, fields[section], q);
    return res.json({ [section]: results });
  }

  // Global search
  res.json({
    projects: db.search('projects', ['title', 'description', 'tags'], q).map(p => ({ ...p, tags: safeJson(p.tags) })),
    articles: db.search('articles', ['title', 'summary', 'content', 'tags'], q).map(a => ({ ...a, tags: safeJson(a.tags) })),
    photos: db.search('photos', ['title', 'description'], q),
    moments: db.search('moments', ['content'], q),
    songs: db.search('songs', ['title', 'artist'], q)
  });
});

// ── Moment Likes ────────────────────────────────────────────

router.get('/moments/:id/likes', (req, res) => {
  const likes = db.getMomentLikes(parseInt(req.params.id));
  const token = req.query.token || '';
  if (token) {
    verifyGitHubUser(token).then(user => {
      const userLiked = user ? likes.some(l => l.username === user.login) : false;
      res.json({ count: likes.length, liked: userLiked, users: likes.map(l => l.username) });
    }).catch(() => res.json({ count: likes.length, liked: false, users: likes.map(l => l.username) }));
    return;
  }
  res.json({ count: likes.length, liked: false, users: likes.map(l => l.username) });
});

router.post('/moments/:id/like', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'GitHub login required' });
  const user = await verifyGitHubUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid GitHub token' });
  const result = db.toggleMomentLike(parseInt(req.params.id), user.login);
  res.json(result);
});

// ── Moment Comments ──────────────────────────────────────────

router.get('/moments/:id/comments', (req, res) => {
  const all = db.getMomentComments(parseInt(req.params.id));
  // Build full recursive tree
  function buildTree(parentId) {
    return all
      .filter(c => c.parent_id === parentId)
      .map(c => ({ ...c, replies: buildTree(c.id) }));
  }
  const threaded = buildTree(null);
  res.json(threaded);
});

router.post('/moments/:id/comments', async (req, res) => {
  const { token, content, parent_id } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Missing content' });
  if (!token) return res.status(401).json({ error: 'GitHub login required' });
  const user = await verifyGitHubUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid GitHub token' });
  const comment = db.addMomentComment(
    parseInt(req.params.id), parent_id || null,
    user.login, user.avatar_url, content, false
  );
  res.status(201).json(comment);
});

// Delete moment comment (owner only, admin comments are protected)
router.delete('/moments/comments/:id', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'GitHub login required' });
  const user = await verifyGitHubUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid GitHub token' });
  const comment = db.all('moment_comments').find(c => c.id === parseInt(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Not found' });
  if (comment.is_admin) return res.status(403).json({ error: 'Cannot delete admin comment' });
  if (comment.github_username !== user.login) return res.status(403).json({ error: 'Not your comment' });
  const ok = db.deleteMomentComment(parseInt(req.params.id));
  res.json({ success: ok });
});

// ── Comments (legacy - music/about) ──────────────────────────

router.get('/comments/:section', (req, res) => {
  const comments = db.all('comments')
    .filter(c => c.section === req.params.section)
    .sort((a, b) => b.id - a.id);
  res.json(comments);
});

router.post('/comments', async (req, res) => {
  const { section, content, token } = req.body;
  if (!section || !content || !content.trim()) {
    return res.status(400).json({ error: 'Missing section or content' });
  }
  if (!token) return res.status(401).json({ error: 'GitHub login required' });

  const user = await verifyGitHubUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid GitHub token' });

  const comment = db.insert('comments', {
    section,
    github_username: user.login,
    github_avatar: user.avatar_url,
    content: content.trim()
  });
  res.json(comment);
});

// Delete legacy comment (owner only, admin comments are protected)
router.delete('/comments/:id', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'GitHub login required' });
  const user = await verifyGitHubUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid GitHub token' });
  const comment = db.all('comments').find(c => c.id === parseInt(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Not found' });
  if (comment.is_admin) return res.status(403).json({ error: 'Cannot delete admin comment' });
  if (comment.github_username !== user.login) return res.status(403).json({ error: 'Not your comment' });
  const ok = db.delete('comments', parseInt(req.params.id));
  res.json({ success: ok });
});

// ── Config (public) ─────────────────────────────────────────

router.get('/config', (req, res) => {
  const all = db.all('config');
  const config = {};
  all.forEach(row => { config[row.key] = row.value; });
  res.json(config);
});

// ── Helpers ─────────────────────────────────────────────────

function safeJson(str) {
  try { return JSON.parse(str); } catch { return []; }
}

module.exports = router;
