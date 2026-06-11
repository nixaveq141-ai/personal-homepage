/**
 * JSON file-based database — zero native dependencies, portable, perfect for personal sites.
 * Each "table" is a .json file under /data/. Provides simple CRUD with auto-increment IDs.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readTable(name) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeTable(name, data) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Table API ──────────────────────────────────────────────

const db = {
  all(name) {
    return readTable(name);
  },

  get(name, id) {
    const rows = readTable(name);
    return rows.find(r => r.id === id) || null;
  },

  insert(name, row) {
    const rows = readTable(name);
    const maxId = rows.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const newRow = { id: maxId + 1, created_at: new Date().toISOString(), ...row };
    rows.push(newRow);
    writeTable(name, rows);
    return newRow;
  },

  update(name, id, updates) {
    const rows = readTable(name);
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...updates, id, updated_at: new Date().toISOString() };
    writeTable(name, rows);
    return rows[idx];
  },

  delete(name, id) {
    const rows = readTable(name);
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return false;
    rows.splice(idx, 1);
    writeTable(name, rows);
    return true;
  },

  search(name, fields, query) {
    if (!query) return db.all(name);
    const q = query.toLowerCase();
    return readTable(name).filter(row =>
      fields.some(f => {
        const val = row[f];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  },

  count(name) {
    return readTable(name).length;
  },

  // Config helpers
  getConfig(key) {
    const rows = readTable('config');
    const row = rows.find(r => r.key === key);
    return row ? row.value : null;
  },

  setConfig(key, value) {
    const rows = readTable('config');
    const idx = rows.findIndex(r => r.key === key);
    if (idx >= 0) {
      rows[idx].value = value;
    } else {
      rows.push({ key, value });
    }
    writeTable('config', rows);
  },

  getAdmin(username) {
    const rows = readTable('admins');
    return rows.find(r => r.username === username) || null;
  },

  // Moment likes
  getMomentLikes(momentId) {
    return readTable('moment_likes').filter(r => r.moment_id === momentId);
  },

  toggleMomentLike(momentId, username) {
    const rows = readTable('moment_likes');
    const idx = rows.findIndex(r => r.moment_id === momentId && r.username === username);
    if (idx >= 0) {
      rows.splice(idx, 1);
      writeTable('moment_likes', rows);
      return { liked: false, count: rows.filter(r => r.moment_id === momentId).length };
    }
    rows.push({ id: Date.now(), moment_id: momentId, username, created_at: new Date().toISOString() });
    writeTable('moment_likes', rows);
    return { liked: true, count: rows.filter(r => r.moment_id === momentId).length };
  },

  // Moment comments (threaded)
  getMomentComments(momentId) {
    return readTable('moment_comments')
      .filter(r => r.moment_id === momentId)
      .sort((a, b) => a.id - b.id);
  },

  addMomentComment(momentId, parentId, username, avatar, content, isAdmin) {
    return db.insert('moment_comments', {
      moment_id: momentId,
      parent_id: parentId || null,
      github_username: username,
      github_avatar: avatar || '',
      content: content.trim(),
      is_admin: isAdmin ? 1 : 0
    });
  },

  deleteMomentComment(id) {
    // Also delete replies to this comment
    const rows = readTable('moment_comments');
    const children = rows.filter(r => r.parent_id === id);
    children.forEach(c => db.delete('moment_comments', c.id));
    return db.delete('moment_comments', id);
  }
};

// ── Initialize with seed data ──────────────────────────────

function initSeed() {
  ensureDir();

  // Only seed if tables are empty
  if (db.count('projects') === 0) {
    db.insert('projects', {
      title: '个人主页', description: '二次元风格的个人主页，毛玻璃特效，响应式设计',
      image_url: '', project_url: 'https://github.com/nixaveq141-ai', tags: '["HTML","CSS","JavaScript","Node.js"]',
      sort_order: 1
    });
  }

  if (db.count('articles') === 0) {
    db.insert('articles', {
      title: '欢迎来到我的主页',
      summary: '这是第一篇示例文章，介绍这个个人主页的功能与设计。',
      content: '<p>欢迎！这是 Puearill 的个人主页。站点采用毛玻璃设计风格，支持暗色模式切换，拥有全局音乐播放器。</p><p>技术栈使用 Node.js + Express 构建后端，前端使用原生 HTML/CSS/JS 实现。</p>',
      cover_image: '', tags: '["欢迎"]',
      sort_order: 1
    });
  }

  if (db.count('photos') === 0) {
    db.insert('photos', {
      title: '示例照片', url: 'https://picsum.photos/800/600', thumbnail_url: 'https://picsum.photos/400/300',
      description: '示例照片描述', sort_order: 1
    });
  }

  if (db.count('songs') === 0) {
    db.insert('songs', {
      title: 'Lemon', artist: '米津玄師',
      audio_url: '', cover_url: '', duration: 0,
      sort_order: 1
    });
    db.insert('lyrics', { song_id: 1, content: JSON.stringify([
      { time: 0, text: '暂无歌词，请在管理后台添加' }
    ])});
  }

  // Default site config
  const configs = [
    ['site_title', "Puearillの主页"],
    ['site_subtitle', '就读于北京理工大学的大一生。'],
    ['about_me', '大家好，我是 Puearill，目前就读于北京理工大学。热爱编程、二次元文化和音乐。喜欢探索新技术，尤其对前端开发和用户体验设计感兴趣。'],
    ['avatar_url', '/assets/avatar.png'],
    ['github_url', 'https://github.com/nixaveq141-ai'],
    ['qq', '3305616186'],
    ['email', '3305616186@qq.com'],
    ['theme_default', 'light'],
    ['education', '北京理工大学 本科在读'],
    ['location', '北京'],
    ['interests', '编程 · 二次元 · 音乐 · 前端开发'],
  ];
  configs.forEach(([k, v]) => { if (db.getConfig(k) === null) db.setConfig(k, v); });

  // Admin — always sync from .env so it stays current
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const admins = readTable('admins');
  const existing = admins.find(a => a.username === username);
  if (existing) {
    existing.password_hash = hash;
    writeTable('admins', admins);
  } else {
    const maxId = admins.reduce((max, a) => Math.max(max, a.id || 0), 0);
    admins.push({ id: maxId + 1, username, password_hash: hash });
    writeTable('admins', admins);
  }
}

initSeed();
console.log('Database initialized at', DATA_DIR);

module.exports = db;
