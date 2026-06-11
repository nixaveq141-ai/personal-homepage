/* ═══════════════ PUEARILL HOMEPAGE — FRONTEND JS ═══════════════ */
(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────
  const GITHUB_CLIENT_ID = 'Ov23liv3nbvC7DYYsgF3';
  let currentSection = 'home';
  let githubToken = localStorage.getItem('gh_token') || null;
  let githubUser = JSON.parse(localStorage.getItem('gh_user') || 'null');

  // ── DOM REFS ────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── INIT ────────────────────────────────────────────────
  function init() {
    /* Reveal animations handled by Intersection Observer in index.html */
    initTheme();
    initParticles();
    initHeaderScroll();
    initCardGlow();
    initRouter();
    initSectionSearch();
    loadHomeBlocks();
    initMusicPlayer();
    loadComments('music');
    loadComments('about');
    initGithubCallback();
    loadAboutConfig();
    updateNavActive();
  }

  // ── THEME ───────────────────────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    $('#themeToggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      initParticles(); // Re-init particles on theme change
    });
  }

  // ── PARTICLE CANVAS ──────────────────────────────────────
  let particleRAF = null;
  let particles = [];
  const PARTICLE_COUNT = 80;

  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (particleRAF) cancelAnimationFrame(particleRAF);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.08 ? 90 : (Math.random() < 0.05 ? 320 : 270 + Math.random() * 20)
      });
    }

    function draw() {
      // Pause when tab hidden or not on home section
      if (document.hidden || currentSection !== 'home') {
        particleRAF = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.3 + 0.7;
        const alpha = p.opacity * twinkle * (isLight ? 0.5 : 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (p.hue === 90) {
          ctx.fillStyle = `oklch(0.78 0.17 90 / ${alpha * 0.9})`;
          ctx.shadowColor = `oklch(0.78 0.17 90 / ${alpha * 0.6})`;
          ctx.shadowBlur = p.r * 4;
        } else if (p.hue === 320) {
          ctx.fillStyle = `oklch(0.55 0.20 320 / ${alpha * 0.7})`;
          ctx.shadowColor = `oklch(0.55 0.20 320 / ${alpha * 0.4})`;
          ctx.shadowBlur = p.r * 3;
        } else {
          ctx.fillStyle = `oklch(0.90 0.01 ${p.hue} / ${alpha})`;
          ctx.shadowColor = `oklch(0.85 0.01 ${p.hue} / ${alpha * 0.5})`;
          ctx.shadowBlur = p.r * 2;
        }
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      particleRAF = requestAnimationFrame(draw);
    }

    draw();
  }

  // ── HEADER SCROLL EFFECT ─────────────────────────────────
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── CARD GLOW TRACKING ───────────────────────────────────
  let cardGlowPending = false;
  let cardGlowMouseX = 0, cardGlowMouseY = 0;
  function initCardGlow() {
    document.addEventListener('mousemove', (e) => {
      cardGlowMouseX = e.clientX;
      cardGlowMouseY = e.clientY;
      if (!cardGlowPending) {
        cardGlowPending = true;
        requestAnimationFrame(() => {
          document.querySelectorAll('.card:hover').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((cardGlowMouseX - rect.left) / rect.width) * 100;
            const y = ((cardGlowMouseY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
          });
          cardGlowPending = false;
        });
      }
    }, { passive: true });
  }

  // ── ROUTER ──────────────────────────────────────────────
  function initRouter() {
    // Desktop nav
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.dataset.nav);
        closeMobileNav();
      });
    });
    // Mobile nav
    $$('.nav-link-mobile').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.dataset.nav);
        closeMobileNav();
      });
    });
    // Logo
    $('.logo-text').addEventListener('click', e => {
      e.preventDefault();
      navigateTo('home');
    });
    // Hamburger
    $('#hamburger').addEventListener('click', toggleMobileNav);
    // ESC closes mobile nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#hamburger').classList.contains('active')) closeMobileNav();
    });
    // Hash change
    window.addEventListener('hashchange', () => {
      const section = window.location.hash.replace('#/', '#').replace('#', '') || 'home';
      navigateTo(section, false);
    });
    // Initial hash
    const hash = window.location.hash.replace('#/', '#').replace('#', '') || 'home';
    if (hash !== 'home') navigateTo(hash, false);
  }

  function navigateTo(section, pushState = true) {
    // Skip if we're already showing this section (handles inline-script pre-render)
    var target = document.getElementById(section);
    if (!pushState && target && target.classList.contains('section-visible')) {
      currentSection = section;
      updateNavActive();
      loadSectionContent(section);
      return;
    }

    if (pushState) {
      history.pushState(null, '', section === 'home' ? '/' : `#/${section}`);
    }

    currentSection = section;

    // Show/hide sections
    $$('.section').forEach(s => s.classList.remove('section-visible'));
    const home = document.getElementById('home');

    if (section === 'home') {
      home.classList.add('section-visible');
    } else if (target) {
      target.classList.add('section-visible');
      loadSectionContent(section);
    }

    updateNavActive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function loadSectionContent(section) {
    switch (section) {
      case 'projects': loadProjects(); break;
      case 'articles': loadArticles(); break;
      case 'photos': loadPhotos(); break;
      case 'music': loadFullMusicPage(); break;
      case 'moments': loadMoments(); break;
      case 'about': loadAboutContent(); break;
    }
  }

  function updateNavActive() {
    $$('.nav-link, .nav-link-mobile').forEach(l => {
      l.classList.toggle('active', l.dataset.nav === currentSection);
    });
  }

  function toggleMobileNav() {
    const ham = $('#hamburger');
    const isOpen = !ham.classList.contains('active');
    ham.classList.toggle('active');
    ham.setAttribute('aria-expanded', isOpen);
    $('#mobileNavOverlay').classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileNav() {
    const ham = $('#hamburger');
    ham.classList.remove('active');
    ham.setAttribute('aria-expanded', 'false');
    $('#mobileNavOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── SECTION SEARCH ──────────────────────────────────────
  function initSectionSearch() {
    $$('.search-input[data-search]').forEach(input => {
      input.addEventListener('input', function () {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => doSearch(this.value, this.dataset.search), 300);
      });
    });
  }

  async function doSearch(query, scope) {
    const resultEl = $(`.section-search-results[data-result="${scope}"]`);
    if (!query || query.trim().length < 1) {
      if (resultEl) resultEl.style.display = 'none';
      return;
    }

    try {
      const params = new URLSearchParams({ q: query, section: scope });
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      renderSectionSearchResults(data, scope, query);
    } catch {
      if (resultEl) resultEl.innerHTML = '<p style="padding:12px;color:var(--stardust)">搜索失败，请重试</p>';
      if (resultEl) resultEl.style.display = 'block';
    }
  }

  function renderSectionSearchResults(data, scope, query) {
    const el = $(`.section-search-results[data-result="${scope}"]`);
    if (!el) return;
    const items = data[scope] || [];
    if (items.length === 0) {
      el.innerHTML = '<p style="padding:12px">未找到相关结果</p>';
      el.style.display = 'block';
      return;
    }
    el.innerHTML = items.map(item =>
      `<div class="search-result-item">${highlightMatch(item.title || item.content?.slice(0, 60) || '无标题', query)}</div>`
    ).join('');
    el.style.display = 'block';
  }

  function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  // ── ERROR HELPER ───────────────────────────────────────
  function showError(container, msg) {
    if (container) {
      container.innerHTML = `<div class="error-state"><span>${msg || '加载失败'}</span> <button class="btn-retry" onclick="location.reload()">重试</button></div>`;
    }
  }

  // ── HOME BLOCKS (Carousel) ──────────────────────────────
  const carousels = {};

  function buildCarousel(trackId, dotsId, items, cardFn) {
    if (!items.length) {
      document.getElementById(trackId).innerHTML = '<p style="padding:16px;color:var(--stardust)">暂无数据</p>';
      return;
    }
    const track = document.getElementById(trackId);
    const dots = document.getElementById(dotsId);
    track.innerHTML = items.map(item => `<div class="carousel-slide">${cardFn(item)}</div>`).join('');
    dots.innerHTML = items.map((_, i) => `<button class="carousel-dot${i===0?' active':''}" data-idx="${i}" aria-label="第${i+1}项"></button>`).join('');

    let idx = 0;
    const total = items.length;
    let timer;
    const update = () => {
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    const startTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => { idx = (idx + 1) % total; update(); }, 3500);
    };
    dots.querySelectorAll('.carousel-dot').forEach(d => {
      d.addEventListener('click', () => { idx = parseInt(d.dataset.idx); update(); startTimer(); });
    });
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', startTimer);
    track.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
    track.addEventListener('touchend', startTimer);
    startTimer();
    carousels[trackId] = { update, timer };
  }

  async function loadHomeBlocks() {
    try {
      const [projectsRes, articlesRes] = await Promise.all([
        fetch('/api/projects?limit=5&_t=' + Date.now()),
        fetch('/api/articles?limit=5&_t=' + Date.now())
      ]);
      if (!projectsRes.ok || !articlesRes.ok) throw new Error('Failed to load');
      const projects = await projectsRes.json();
      const articles = await articlesRes.json();

      buildCarousel('trackProjects', 'dotsProjects', projects, p => `
        <div class="scroll-card" onclick="window._goToPage('projects')">
          ${(p.cover_image || p.image_url) ? `<img src="${p.cover_image || p.image_url}" alt="${p.title}" loading="lazy">` : ''}
          <h4>${p.title}</h4>
          <p>${p.description || ''}</p>
        </div>`);

      buildCarousel('trackArticles', 'dotsArticles', articles, a => `
        <div class="scroll-card" onclick="window._goToPage('articles')">
          ${a.cover_image ? `<img src="${a.cover_image}" alt="${a.title}" loading="lazy">` : ''}
          <h4>${a.title}</h4>
          <p>${a.summary || ''}</p>
        </div>`);
    } catch {
      showError(document.getElementById('trackProjects'), '项目加载失败');
      showError(document.getElementById('trackArticles'), '文章加载失败');
    }
  }

  window._goToPage = function(section) {
    navigateTo(section);
  };


  // ── FULL PROJECTS PAGE ──────────────────────────────────
  async function loadProjects() {
    try {
      const res = await fetch('/api/projects?_t=' + Date.now());
      const data = await res.json();
      $('#projectsGrid').innerHTML = data.map(p => `
        <div class="card reveal">
          ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" class="card-image" loading="lazy">` : ''}
          <h3>${p.title}</h3>
          <p>${p.description || ''}</p>
          ${p.tags ? `<div class="card-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          ${p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px">查看项目</a>` : ''}
        </div>
      `).join('') || '<p>暂无项目</p>';
      if(window._observeReveal) window._observeReveal();
    } catch { showError($('#projectsGrid'), '项目加载失败'); }
  }

  // ── FULL ARTICLES PAGE ──────────────────────────────────
  window._openArticle = async function(id) {
    try {
      const res = await fetch('/api/articles?_t=' + Date.now());
      const articles = await res.json();
      const a = articles.find(x => x.id === id);
      if (!a) return;
      document.getElementById('articleDetailTitle').textContent = a.title;
      document.getElementById('articleDetailMeta').textContent = new Date(a.created_at).toLocaleString('zh-CN', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
      document.getElementById('articleDetailBody').innerHTML = a.content || a.summary || '';
      document.getElementById('articlesGrid').style.display = 'none';
      const hdr = document.querySelector('#articles .section-header');
      if (hdr) hdr.style.display = 'none';
      document.getElementById('articleDetail').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { /* ignore */ }
  };

  window._closeArticle = function() {
    document.getElementById('articleDetail').style.display = 'none';
    if (window._articleFromHome) {
      window._articleFromHome = false;
      document.getElementById('articlesGrid').style.display = '';
      navigateTo('home');
    } else {
      document.getElementById('articlesGrid').style.display = '';
      const hdr = document.querySelector('#articles .section-header');
      if (hdr) hdr.style.display = '';
    }
  };

  async function loadArticles() {
    try {
      const res = await fetch('/api/articles?_t=' + Date.now());
      const data = await res.json();
      $('#articlesGrid').innerHTML = data.map(a => `
        <div class="card reveal" onclick="window._openArticle(${a.id})">
          ${a.cover_image ? `<img src="${a.cover_image}" alt="${a.title}" class="card-image" loading="lazy">` : ''}
          <h3>${a.title}</h3>
          <p>${a.summary || ''}</p>
          ${a.tags ? `<div class="card-tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      `).join('') || '<p>暂无文章</p>';
      if(window._observeReveal) window._observeReveal();
    } catch { showError($('#articlesGrid'), '文章加载失败'); }
  }

  // ── FULL PHOTOS PAGE ────────────────────────────────────
  async function loadPhotos() {
    try {
      const res = await fetch('/api/photos?_t=' + Date.now());
      const data = await res.json();
      $('#photosGrid').innerHTML = data.map(p => `
        <div class="masonry-item reveal">
          <img src="${p.thumbnail_url || p.url}" alt="${p.title || '照片'}" loading="lazy"
               onclick="window.openLightbox('${p.url}')">
          ${(p.title || p.description) ? `<div class="photo-caption">${p.title || p.description}</div>` : ''}
        </div>
      `).join('') || '<p>暂无照片</p>';
      if(window._observeReveal) window._observeReveal();
    } catch { showError($('#photosGrid'), '照片加载失败'); }
  }

  window.openLightbox = function (url, title) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = url;
    img.alt = title || '照片预览';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox-close').focus();
  };
  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.addEventListener('DOMContentLoaded', () => {
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
      });
      lb.querySelector('.lightbox-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('active')) closeLightbox();
      });
    }
  });

  // ── MOMENTS PAGE ────────────────────────────────────────
  let momentsData = [];
  let momentsRendering = false;

  async function loadMoments() {
    try {
      const res = await fetch('/api/moments');
      momentsData = await res.json();
      await renderMoments();
      if(window._observeReveal) window._observeReveal();
    } catch(e) { console.error('loadMoments error:', e); showError($('#momentsList'), '说说加载失败'); }
  }

  async function renderMoments() {
    if (momentsRendering) return;
    momentsRendering = true;
    try {
    const el = $('#momentsList');
    if (!el) { momentsRendering = false; return; }
    if (!momentsData.length) {
      el.innerHTML = '<p style="text-align:center;color:var(--stardust);padding:40px">还没有说说</p>';
      momentsRendering = false;
      return;
    }
    let html = '';
    for (const m of momentsData) {
      const [likes, comments] = await Promise.all([
        fetch(`/api/moments/${m.id}/likes${githubToken ? '?token=' + githubToken : ''}`).then(r => r.json()).catch(() => ({count:0,liked:false})),
        fetch(`/api/moments/${m.id}/comments`).then(r => r.json()).catch(() => [])
      ]);
      // Apply sort preference
      const sortOrder = localStorage.getItem('moment_sort_' + m.id) || 'oldest';
      function sortTree(list, order) {
        list.sort((a, b) => order === 'oldest' ? a.id - b.id : b.id - a.id);
        list.forEach(c => { if (c.replies) sortTree(c.replies, order); });
      }
      sortTree(comments, sortOrder);
      function countTree(list) {
        return list.reduce((s, c) => s + 1 + (c.replies ? countTree(c.replies) : 0), 0);
      }
      const commentCount = countTree(comments);
      html += `
        <div class="moment-card reveal" id="moment-${m.id}">
          <div class="moment-content">${m.content}</div>
          <div class="moment-time">${new Date(m.created_at).toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
          <div class="moment-actions">
            <button class="moment-btn moment-like-btn ${likes.liked ? 'liked' : ''}" onclick="window._toggleMomentLike(${m.id}, this)" data-mid="${m.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> <span class="like-count">${likes.count || ''}</span>
            </button>
            <button class="moment-btn moment-comment-btn" onclick="window._toggleMomentComments(${m.id}, this)" data-mid="${m.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> <span>${commentCount || ''}</span>
            </button>
          </div>
          <div class="moment-comments-wrap" id="momentComments-${m.id}">
            <div class="moment-comments-top">
              <span class="comments-login-hint">评论</span>
              ${githubUser ? `
                <div class="user-dropdown" id="momentUserDropdown-${m.id}">
                  <button class="user-dropdown-btn" onclick="window._toggleMomentUserDropdown(${m.id})">${githubUser.login}</button>
                  <div class="user-dropdown-menu" id="momentUserDropdownMenu-${m.id}" style="display:none">
                    <a href="javascript:void(0)" onclick="window._sortMomentComments(${m.id},'newest')"><span class="sort-dot" style="visibility:${(localStorage.getItem('moment_sort_'+m.id)||'newest')==='newest'?'visible':'hidden'}"></span>从新到旧排序</a>
                    <a href="javascript:void(0)" onclick="window._sortMomentComments(${m.id},'oldest')"><span class="sort-dot" style="visibility:${(localStorage.getItem('moment_sort_'+m.id)||'newest')==='oldest'?'visible':'hidden'}"></span>从旧到新排序</a>
                    <a href="javascript:window._logoutGithub()">退出登录</a>
                  </div>
                </div>
              ` : `
                <button class="btn-github-login" onclick="window._loginGithub()">GitHub 登录</button>
              `}
            </div>
            <div class="moment-comments-list" id="momentCommentsList-${m.id}" data-full-count="${comments.length}">
              ${comments.length ? renderCommentThread(comments, 3) : '<p style="color:var(--stardust);font-size:0.85rem;padding:8px">暂无评论</p>'}
            </div>
            ${comments.length > 3 ? `<button class="moment-show-more" onclick="window._expandMomentComments(${m.id}, this)" data-mid="${m.id}">展示更多评论</button>` : ''}
            <div class="moment-comment-input">
              <div style="flex:1;display:flex;flex-direction:column;gap:4px">
                <span class="reply-tag" id="replyTag-${m.id}" style="display:none"></span>
                <textarea placeholder="写评论..." id="momentCommentText-${m.id}" rows="2"></textarea>
              </div>
              ${githubUser ? `
                <button class="btn-comment-submit" onclick="window._submitMomentComment(${m.id})">发布</button>
              ` : `
                <button class="btn-comment-submit btn-login-only" onclick="window._loginGithub()">GitHub 登录</button>
              `}
            </div>
          </div>
        </div>`;
    }
    el.innerHTML = html;
    // Directly reveal cards — don't rely on IntersectionObserver for dynamic content
    el.querySelectorAll('.reveal').forEach(card => card.classList.add('revealed'));
    } catch(e) { console.error('renderMoments error:', e); }
    momentsRendering = false;
  }

  function renderCommentThread(comments, maxVisible, depth, parentContent) {
    depth = depth || 0;
    const visible = maxVisible ? comments.slice(0, maxVisible) : comments;
    if (!visible.length) return '';
    const isReply = depth > 0;
    const marginLeft = isReply ? 'margin-left:44px' : '';
    const borderLeft = isReply ? 'border-left:2px solid var(--accent);padding-left:12px;' : '';
    let html = '';
    for (const c of visible) {
      const prefix = depth >= 1 && parentContent
        ? '<div class="reply-prefix">回复 @' + (parentContent.username || '') + '：' + (parentContent.text || '') + '</div>'
        : '';
      html += `
      <div class="moment-comment-item" style="${marginLeft};${borderLeft};margin-top:8px">
        <img src="${c.github_avatar || ''}" class="comment-item-avatar">
        <div class="comment-item-body">
          <div class="comment-item-header">
            <span class="comment-item-name">${c.github_username}${c.is_admin ? ' <span class="author-tag">作者</span>' : ''}</span>
            <span class="comment-item-time">${new Date(c.created_at).toLocaleString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>
          </div>
          ${prefix}
          <div class="comment-item-text">${c.content}</div>
          <button class="moment-reply-btn" onclick="window._showMomentReplyInput(${c.moment_id}, ${c.id})">回复</button>
          ${githubUser && c.github_username === githubUser.login && !c.is_admin ? `<button class="moment-delete-btn" onclick="window._deleteMomentComment(${c.moment_id}, ${c.id})">删除</button>` : ''}
        </div>
      </div>`;
      // Render nested replies: only fold at first level (depth 0 → depth 1)
      if (c.replies && c.replies.length) {
        if (depth === 0) {
          // Flatten all nested replies into one visual list, fold if > 3
          function flattenAll(list) {
            let f = [];
            for (const x of list) {
              const clone = { ...x, replies: [] }; // strip nested replies for flat render
              f.push(clone);
              if (x.replies && x.replies.length) f = f.concat(flattenAll(x.replies));
            }
            return f;
          }
          const allFlat = flattenAll(c.replies);
          const limit = 3;
          if (allFlat.length > limit) {
            html += renderCommentThread(allFlat.slice(0, limit), 0, 1, {username: c.github_username, text: c.content.slice(0, 30)});
            html += `<button class="moment-show-more" style="margin-left:44px;margin-top:4px;font-size:0.78rem" onclick="window._expandReplyReplies(this, '${c.id}')">展开全部回复 (${allFlat.length - limit})</button>`;
          } else {
            html += renderCommentThread(c.replies, 0, 1, {username: c.github_username, text: c.content.slice(0, 30)});
          }
        } else {
          html += renderCommentThread(c.replies, 0, depth + 1, {username: c.github_username, text: c.content.slice(0, 30)});
        }
      }
    }
    return html;
  }

  window._expandReplyReplies = async function(btn, commentId) {
    const momentId = btn.closest('[id^="moment-"]')?.id?.replace('moment-', '');
    if (!momentId) return;
    const comments = await fetch(`/api/moments/${momentId}/comments`).then(r => r.json()).catch(() => []);
    function findComment(cs, id) {
      for (const c of cs) {
        if (c.id === parseInt(id)) return c;
        if (c.replies) { const f = findComment(c.replies, id); if (f) return f; }
      }
      return null;
    }
    const parent = findComment(comments, commentId);
    if (parent && parent.replies) {
      const sortOrder = localStorage.getItem('moment_sort_' + momentId) || 'oldest';
      function sortTree(list) { list.sort((a,b)=>sortOrder==='oldest'?a.id-b.id:b.id-a.id); list.forEach(c=>{if(c.replies)sortTree(c.replies)}); }
      sortTree(parent.replies);
      // Find the parent comment element by walking backwards from button
      let parentEl = btn.previousElementSibling;
      while (parentEl && parentEl.classList.contains('moment-comment-item') && parentEl.style.marginLeft) {
        parentEl = parentEl.previousElementSibling;
      }
      if (!parentEl || !parentEl.classList.contains('moment-comment-item')) return;
      // Remove existing folded replies after parent (only indented ones, stop at next top-level comment)
      let next = parentEl.nextElementSibling;
      while (next) {
        const isReply = next.classList.contains('moment-comment-item') && next.style.marginLeft;
        const isFoldBtn = next.classList.contains('moment-show-more');
        if (isReply || isFoldBtn) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        } else {
          break; // Stop at next top-level comment or other element
        }
      }
      // Render all replies in full recursive glory
      const html = renderCommentThread(parent.replies, 0, 1, {username: parent.github_username, text: parent.content.slice(0, 30)});
      parentEl.insertAdjacentHTML('afterend', html);
    }
  };

  window._expandMomentComments = async function(momentId, btn) {
    const comments = await fetch(`/api/moments/${momentId}/comments`).then(r => r.json()).catch(() => []);
    const sortOrder = localStorage.getItem('moment_sort_' + momentId) || 'oldest';
    function sortTree(list) { list.sort((a,b)=>sortOrder==='oldest'?a.id-b.id:b.id-a.id); list.forEach(c=>{if(c.replies)sortTree(c.replies)}); }
    sortTree(comments);
    // Only append the remaining top-level comments (skip first 3 already shown)
    const remaining = comments.slice(3);
    const html = renderCommentThread(remaining, 0, 0);
    btn.insertAdjacentHTML('beforebegin', html);
    btn.style.display = 'none';
  };

  // ── Moment interaction globals ──────────────────────────
  window._toggleMomentLike = async function(momentId, btn) {
    if (!githubToken) { alert('请先使用 GitHub 登录'); window._loginGithub(); return; }
    try {
      const res = await fetch(`/api/moments/${momentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      });
      const data = await res.json();
      btn.classList.toggle('liked', data.liked);
      const span = btn.querySelector('.like-count');
      span.textContent = data.count > 0 ? ' ' + data.count : '';
    } catch { /* ignore */ }
  };

  window._toggleMomentComments = function(momentId, btn) {
    const wrap = document.getElementById('momentComments-' + momentId);
    if (wrap.style.display === 'none') {
      wrap.style.display = 'block';
    } else {
      wrap.style.display = 'none';
    }
  };

  window._submitMomentComment = async function(momentId) {
    const textEl = document.getElementById('momentCommentText-' + momentId);
    const content = textEl.value.trim();
    if (!content) return;
    const parentId = textEl.dataset.replyTo || null;
    try {
      const res = await fetch(`/api/moments/${momentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken, content, parent_id: parentId ? parseInt(parentId) : null })
      });
      if (res.ok) {
        const newComment = await res.json();
        textEl.value = '';
        delete textEl.dataset.replyTo;
        const tag = document.getElementById('replyTag-' + momentId);
        if (tag) tag.style.display = 'none';
        textEl.placeholder = '写评论...';
        // Just insert the new comment into the DOM, don't re-render everything
        const commentsList = document.getElementById('momentCommentsList-' + momentId);
        const newHtml = renderCommentThread([{ ...newComment, replies: [] }], 0, parentId ? 1 : 0, null);
        if (parentId) {
          // Find the parent comment element and insert after it
          const parentBtn = document.querySelector(`[onclick*="_showMomentReplyInput(${momentId}, ${parentId})"]`);
          const parentCommentEl = parentBtn ? parentBtn.closest('.moment-comment-item') : null;
          if (parentCommentEl) {
            parentCommentEl.insertAdjacentHTML('afterend', newHtml);
          } else {
            commentsList.insertAdjacentHTML('beforeend', newHtml);
          }
        } else {
          // New top-level comment — add at end of list
          commentsList.insertAdjacentHTML('beforeend', newHtml);
        }
        // Update comment count display
        const countEl = document.querySelector(`#moment-${momentId} .moment-comment-btn span`);
        if (countEl) {
          const current = parseInt(countEl.textContent) || 0;
          countEl.textContent = current + 1 || '1';
        }
      }
    } catch { /* ignore */ }
  };

  window._showMomentReplyInput = function(momentId, parentId) {
    if (!githubUser) { alert('请先使用 GitHub 登录'); window._loginGithub(); return; }
    const textEl = document.getElementById('momentCommentText-' + momentId);
    const tag = document.getElementById('replyTag-' + momentId);
    fetch(`/api/moments/${momentId}/comments`).then(r => r.json()).then(comments => {
      function findComment(cs, id) {
        for (const c of cs) {
          if (c.id === id) return c;
          if (c.replies && c.replies.length) {
            const found = findComment(c.replies, id);
            if (found) return found;
          }
        }
        return null;
      }
      const c = findComment(comments, parentId);
      const username = c ? c.github_username : '';
      const preview = c ? (c.content.length > 30 ? c.content.slice(0, 30) + '...' : c.content) : '';
      textEl.dataset.replyTo = parentId;
      tag.innerHTML = '回复 @<b>' + username + '</b>：' + preview;
      tag.style.display = 'block';
      textEl.placeholder = '输入回复内容...';
      textEl.focus();
    });
  };

  // ── ABOUT PAGE ───────────────────────────────────────────
  async function loadAboutContent() {
    // About content is loaded once at init; refresh if needed
    await loadAboutConfig();
  }

  async function loadAboutConfig() {
    try {
      const res = await fetch('/api/config');
      const config = await res.json();

      // Update hero subtitle
      const subtitleEl = $('#heroSubtitle');
      if (subtitleEl && config.site_subtitle) subtitleEl.textContent = config.site_subtitle;

      // Update avatars
      if (config.avatar_url) {
        const heroAvatar = $('#heroAvatar');
        const aboutAvatar = $('.about-avatar');
        if (heroAvatar) heroAvatar.src = config.avatar_url;
        if (aboutAvatar) aboutAvatar.src = config.avatar_url;
      }

      // Update about text
      const aboutEl = $('#aboutContent');
      if (aboutEl && config.about_me) {
        aboutEl.innerHTML = config.about_me.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
      }

      // Update about details
      const detailsEl = $('.about-details');
      if (detailsEl) {
        detailsEl.innerHTML = [
          ['教育经历', config.education],
          ['所在城市', config.location],
          ['兴趣', config.interests],
        ].filter(([, v]) => v).map(([label, val]) =>
          `<div class="detail-item"><span class="detail-label">${label}</span><span>${val}</span></div>`
        ).join('');
      }

      // Update hero contact info
      const contactEl = document.getElementById('heroContact');
      if (contactEl) {
        const parts = [];
        if (config.github_url) parts.push(`<a href="${config.github_url}" target="_blank" rel="noopener" class="contact-link">GitHub</a>`);
        if (config.qq) parts.push(`<button class="contact-link contact-copy" data-copy="${config.qq}" onclick="navigator.clipboard.writeText('${config.qq}');var t=this;t.textContent='已复制';setTimeout(function(){t.textContent='QQ'},1500)">QQ</button>`);
        if (config.email) parts.push(`<a href="mailto:${config.email}" class="contact-link">Email</a>`);
        contactEl.innerHTML = parts.join('');
      }
    } catch { showError($('#aboutContent'), '信息加载失败'); }
  }

  // ── MUSIC PLAYER ────────────────────────────────────────
  let playlist = [];
  let currentTrackIdx = -1;
  let audio = null;
  let lyrics = [];
  let isPlaying = false;

  function initMusicPlayer() {
    audio = new Audio();
    audio.volume = 0.7;

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('loadedmetadata', () => {
      const tt = document.getElementById('timeTotal');
      if (tt) tt.textContent = formatTime(audio.duration);
      const hptt = document.getElementById('hpTimeTotal');
      if (hptt) hptt.textContent = formatTime(audio.duration);
    });

    // Mini player controls — inline onclick in HTML calls these globals
    window._mpPlay = () => togglePlay();
    window._mpPrev = () => prevTrack();
    window._mpNext = () => nextTrack();

    // Full player controls
    document.getElementById('fpPlay').addEventListener('click', togglePlay);
    document.getElementById('fpPrev').addEventListener('click', prevTrack);
    document.getElementById('fpNext').addEventListener('click', nextTrack);

    // Progress bar (full player & home player) — click + drag
    function seekBar(e) {
      if (!audio || !audio.duration) return;
      var rect = e.currentTarget.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    }
    function bindSeekDrag(barId) {
      var bar = document.getElementById(barId);
      if (!bar) return;
      var dragging = false;
      bar.addEventListener('mousedown', function(e) {
        dragging = true;
        seekBar(e);
      });
      document.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        seekBar({ currentTarget: bar, clientX: e.clientX });
      });
      document.addEventListener('mouseup', function() { dragging = false; });
      bar.addEventListener('click', seekBar);
    }
    bindSeekDrag('progressBar');
    bindSeekDrag('hpProgressBar');

    // Volume
    var volSlider = document.getElementById('volumeSlider');
    function updateVolTrack() {
      volSlider.style.setProperty('--vol-pct', volSlider.value + '%');
    }
    volSlider.addEventListener('input', function () {
      audio.volume = this.value / 100;
      updateVolTrack();
    });
    updateVolTrack(); // set initial track fill

    // Handle audio load errors
    audio.addEventListener('error', () => {
      setPlaying(false);
    });

    loadSongs();
  }

  async function loadSongs() {
    try {
      const res = await fetch('/api/songs');
      playlist = await res.json();
      renderPlaylist();
      if (playlist.length > 0 && currentTrackIdx === -1) {
        currentTrackIdx = 0;
        loadTrack(0, false);
      } else if (playlist.length === 0) {
        const homeTitle = document.getElementById('homeTitle');
        const homeArtist = document.getElementById('homeArtist');
        if (homeTitle) homeTitle.textContent = '来听听歌';
        if (homeArtist) { homeArtist.textContent = '点击探索音乐'; homeArtist.style.cursor = 'pointer'; }
      }
    } catch { showError($('#playlist'), '音乐加载失败'); }
  }

  async function loadFullMusicPage() {
    await loadSongs();
    renderPlaylist();
  }

  function renderPlaylist() {
    const el = document.getElementById('playlist');
    if (!playlist.length) {
      el.innerHTML = '<p style="color:var(--stardust);padding:12px">歌单为空</p>';
      return;
    }
    el.innerHTML = playlist.map((s, i) => `
      <div class="playlist-item${i === currentTrackIdx ? ' active' : ''}" data-idx="${i}">
        <div class="playlist-item-cover" style="background-image:url('${s.cover_url || ''}')"></div>
        <div class="playlist-item-info">
          <div class="playlist-item-title">${s.title}</div>
          <div class="playlist-item-artist">${s.artist || '未知'}</div>
        </div>
      </div>
    `).join('');

    // Click handlers
    el.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx);
        loadTrack(idx, true);
      });
    });
  }

  function loadTrack(idx, play = true) {
    if (idx < 0 || idx >= playlist.length) return;
    currentTrackIdx = idx;
    const song = playlist[idx];

    // Reset state for new track before doing anything async
    setPlaying(false);
    audio.src = song.audio_url || '';
    const homeTitle = document.getElementById('homeTitle');
    if (homeTitle) homeTitle.textContent = song.title;
    const homeArtist = document.getElementById('homeArtist');
    if (homeArtist) homeArtist.textContent = song.artist || '未知';
    document.getElementById('playerTitle').textContent = song.title;
    document.getElementById('playerArtist').textContent = song.artist || '未知';

    const cover = document.getElementById('playerCover');
    const homeCover = document.getElementById('homeCover');
    if (song.cover_url) {
      cover.src = song.cover_url;
      cover.style.display = '';
      if (homeCover) homeCover.style.backgroundImage = `url('${song.cover_url}')`;
    } else {
      cover.style.display = 'none';
      if (homeCover) homeCover.style.backgroundImage = '';
    }

    loadLyrics(song.id);
    renderPlaylist();

    if (play && song.audio_url) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  async function loadLyrics(songId) {
    try {
      const res = await fetch(`/api/songs/${songId}/lyrics`);
      lyrics = await res.json();
      renderLyrics();
    } catch {
      lyrics = [];
      document.getElementById('lyricsScroll').innerHTML = '<p class="lyric-placeholder">暂无歌词</p>';
    }
  }

  function renderLyrics() {
    const el = document.getElementById('lyricsScroll');
    if (!lyrics.length) {
      el.innerHTML = '<p class="lyric-placeholder">暂无歌词</p>';
      return;
    }
    el.innerHTML = lyrics.map((l, i) =>
      `<div class="lyric-line" data-lyric-idx="${i}" data-time="${l.time}">${l.text}</div>`
    ).join('');
  }

  function updateProgress() {
    if (!audio || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = pct + '%';
    const hpFill = document.getElementById('hpProgressFill');
    if (hpFill) hpFill.style.width = pct + '%';
    const timeCur = document.getElementById('timeCurrent');
    if (timeCur) timeCur.textContent = formatTime(audio.currentTime);
    const hpTimeCur = document.getElementById('hpTimeCurrent');
    if (hpTimeCur) hpTimeCur.textContent = formatTime(audio.currentTime);

    // Sync lyrics
    syncLyrics(audio.currentTime);

    // Home lyric bar
    const homeLyric = document.getElementById('homeLyric');
    if (homeLyric && lyrics.length) {
      let text = '';
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (audio.currentTime >= lyrics[i].time) { text = lyrics[i].text; break; }
      }
      homeLyric.textContent = text;
      homeLyric.style.display = text ? '' : 'none';
    }
  }

  function syncLyrics(currentTime) {
    const lines = document.querySelectorAll('#lyricsScroll .lyric-line');
    if (!lines.length) return;
    let activeIdx = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) { activeIdx = i; break; }
    }
    lines.forEach(l => l.classList.remove('active'));
    if (activeIdx >= 0 && activeIdx < lines.length) {
      lines[activeIdx].classList.add('active');
      const scrollEl = document.getElementById('lyricsScroll');
      const viewEl = document.getElementById('lyricsBox');
      const lineTop = lines[activeIdx].offsetTop;
      const viewH = viewEl.offsetHeight;
      // Keep active line at 1/3 from the top of the viewport
      const offset = lineTop - viewH / 3;
      scrollEl.style.transform = `translateY(-${Math.max(0, offset)}px)`;
    }
  }

  function syncMiniLyric() {
    // Mini lyric removed — was pushing the player height
  }

  function togglePlay() {
    if (!audio.src && playlist.length > 0) {
      loadTrack(0, true);
      return;
    }
    if (!audio.src) {
      // Songs not loaded yet — re-fetch then retry
      loadSongs().then(() => {
        if (playlist.length > 0) {
          loadTrack(0, true);
        }
      });
      return;
    }
    if (isPlaying) {
      audio.pause();
      setPlaying(false);
      const hl = document.getElementById('homeLyric');
      if (hl) hl.style.display = 'none';
    } else {
      audio.play().then(() => {
        setPlaying(true);
        const hl = document.getElementById('homeLyric');
        if (hl && lyrics.length) hl.style.display = '';
      }).catch(() => {
        setPlaying(false);
      });
    }
  }

  function setPlaying(state) {
    isPlaying = state;
    updatePlayButtons();
  }

  function updatePlayButtons() {
    const icons = document.querySelectorAll('#hpPlay, #fpPlay');
    icons.forEach(btn => { btn.innerHTML = isPlaying
      ? '<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg>'
      : '<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg>'; });
  }

  function prevTrack() {
    if (playlist.length === 0) return;
    const idx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
    loadTrack(idx, isPlaying);
  }

  function nextTrack() {
    if (playlist.length === 0) return;
    const idx = (currentTrackIdx + 1) % playlist.length;
    loadTrack(idx, isPlaying);
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ── GITHUB OAUTH COMMENTS ───────────────────────────────
  function initGithubCallback() {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Save code to localStorage for async processing, then immediately
      // redirect to the return page (preserving hash). The code will be
      // exchanged once the page finishes loading at the right section.
      const returnPath = localStorage.getItem('gh_return') || '#/home';
      localStorage.setItem('gh_pending_code', code);
      // Clean URL and go to return page
      window.location.replace(window.location.pathname + returnPath);
      return; // Stop — page will reload at returnPath
    }

    // Process any pending code from a previous redirect
    const pendingCode = localStorage.getItem('gh_pending_code');
    if (pendingCode) {
      localStorage.removeItem('gh_pending_code');
      handleGithubCallback(pendingCode);
    }

    // Setup comment forms
    setupCommentForms();
    updateGithubUI();
    // Init sort dot: default newest
    document.querySelectorAll('.user-dropdown-menu').forEach(menu => {
      menu.querySelectorAll('.sort-dot').forEach(d => d.style.visibility = 'hidden');
      const first = menu.querySelector('a');
      if (first) { const dot = first.querySelector('.sort-dot'); if (dot) dot.style.visibility = 'visible'; }
    });
  }

  function loginWithGithub() {
    if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === 'your-github-oauth-client-id') {
      alert('请先在 GitHub OAuth App 中配置 Client ID');
      return;
    }
    // Save current page so we can return after OAuth
    const returnPath = window.location.hash || '#/home';
    localStorage.setItem('gh_return', returnPath);
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = 'read:user';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  }

  async function handleGithubCallback(code) {
    try {
      const res = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.access_token && data.user) {
        githubToken = data.access_token;
        githubUser = data.user;
        localStorage.setItem('gh_token', githubToken);
        localStorage.setItem('gh_user', JSON.stringify(githubUser));
        localStorage.removeItem('gh_return');
        updateGithubUI();
        loadComments('music');
        loadComments('about');
        if (currentSection === 'moments' && momentsData.length > 0) {
          renderMoments();
        }
      }
    } catch (e) {
      alert('GitHub 登录失败，请重试');
    }
  }

  function logoutGithub() {
    githubToken = null;
    githubUser = null;
    localStorage.removeItem('gh_token');
    localStorage.removeItem('gh_user');
    updateGithubUI();
    if (currentSection === 'moments' && momentsData.length > 0) {
      renderMoments();
    }
    loadComments('music');
    loadComments('about');
  }

  let commentSortOrder = 'newest'; // 'newest' or 'oldest'

  function updateGithubUI() {
    ['Music', 'About'].forEach(section => {
      const loginHint = document.querySelector(`#commentsLogin${section} .comments-login-hint`);
      const loginBtn = document.getElementById(`btnGithubLogin${section}`);
      const dropdown = document.getElementById(`userDropdown${section}`);
      const dropdownBtn = document.getElementById(`userDropdownBtn${section}`);
      if (!loginBtn || !dropdown) return;
      if (githubUser) {
        if (loginHint) loginHint.style.display = 'none';
        loginBtn.style.display = 'none';
        dropdown.style.display = '';
        if (dropdownBtn) dropdownBtn.textContent = githubUser.login;
        // Show submit button in input area
        const submitBtn = document.getElementById(`btnCommentSubmit${section}`);
        if (!submitBtn) {
          const wrap = document.getElementById(`commentInputWrap${section}`);
          if (wrap) {
            const btn = document.createElement('button');
            btn.className = 'btn-comment-submit';
            btn.id = `btnCommentSubmit${section}`;
            btn.textContent = '发布';
            btn.addEventListener('click', async function() {
              const textarea = document.getElementById(`commentText${section}`);
              const content = textarea.value.trim();
              if (!content) return;
              try {
                const res = await fetch('/api/comments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ section: section.toLowerCase(), content, token: githubToken })
                });
                if (res.ok) {
                  textarea.value = '';
                  loadComments(section.toLowerCase());
                }
              } catch { /* ignore */ }
            });
            wrap.appendChild(btn);
          }
        }
      } else {
        if (loginHint) loginHint.style.display = '';
        loginBtn.style.display = '';
        dropdown.style.display = 'none';
        // Remove submit button
        const submitBtn = document.getElementById(`btnCommentSubmit${section}`);
        if (submitBtn) submitBtn.remove();
      }
    });
  }

  window._toggleUserDropdown = function(section) {
    const menu = document.getElementById('userDropdownMenu' + section);
    const isOpen = menu.style.display === 'block';
    // Close all dropdowns first
    document.querySelectorAll('.user-dropdown-menu').forEach(m => m.style.display = 'none');
    if (!isOpen) menu.style.display = 'block';
  };

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-dropdown')) {
      document.querySelectorAll('.user-dropdown-menu').forEach(m => m.style.display = 'none');
    }
  });

  window._sortComments = function(section, order) {
    commentSortOrder = order;
    document.getElementById('userDropdownMenu' + section).style.display = 'none';
    // Update dot indicator
    const menu = document.getElementById('userDropdownMenu' + section);
    menu.querySelectorAll('.sort-dot').forEach(d => d.style.visibility = 'hidden');
    const items = menu.querySelectorAll('a');
    for (const a of items) {
      if (a.onclick && a.onclick.toString().includes("'"+order+"'")) {
        const dot = a.querySelector('.sort-dot');
        if (dot) dot.style.visibility = 'visible';
      }
    }
    loadComments(section.toLowerCase());
  };

  window._logoutGithub = () => logoutGithub();
  window._loginGithub = () => loginWithGithub();

  window._deleteMomentComment = async function(momentId, commentId) {
    if (!confirm('确定删除这条评论？')) return;
    try {
      await fetch(`/api/moments/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      });
      const mRes = await fetch('/api/moments');
      momentsData = await mRes.json();
      renderMoments();
    } catch { /* ignore */ }
  };

  window._deleteLegacyComment = async function(section, commentId) {
    if (!confirm('确定删除这条留言？')) return;
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      });
      loadComments(section);
    } catch { /* ignore */ }
  };

  window._toggleMomentUserDropdown = function(momentId) {
    const menu = document.getElementById('momentUserDropdownMenu-' + momentId);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  };

  window._sortMomentComments = async function(momentId, order) {
    const menu = document.getElementById('momentUserDropdownMenu-' + momentId);
    if (menu) menu.style.display = 'none';
    localStorage.setItem('moment_sort_' + momentId, order);
    await renderMoments();
  };

  function setupCommentForms() {
    // Comment submit is now handled dynamically in updateGithubUI
  }

  async function loadComments(section) {
    try {
      const res = await fetch(`/api/comments/${section}`);
      let data = await res.json();
      // Sort
      if (commentSortOrder === 'oldest') data.sort((a, b) => a.id - b.id);
      else data.sort((a, b) => b.id - a.id); // newest first
      const el = document.getElementById(`commentList${section === 'music' ? 'Music' : 'About'}`);
      if (!el) return;
      if (!data.length) {
        el.innerHTML = '<p style="color:var(--stardust);padding:12px">暂无留言</p>';
        return;
      }
      el.innerHTML = data.map(c => `
        <div class="comment-item">
          <img src="${c.github_avatar || ''}" alt="" class="comment-item-avatar" loading="lazy">
          <div class="comment-item-body">
            <div class="comment-item-header">
              <span class="comment-item-name">${c.github_username}${c.is_admin ? ' <span class="author-tag">作者</span>' : ''}</span>
              <span class="comment-item-time">${new Date(c.created_at).toLocaleString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>
            </div>
            <div class="comment-item-text">${c.content}</div>
            ${githubUser && c.github_username === githubUser.login && !c.is_admin ? `<button class="moment-delete-btn" onclick="window._deleteLegacyComment('${section}', ${c.id})">删除</button>` : ''}
          </div>
        </div>
      `).join('');
    } catch { /* ignore */ }
  }

  // ── TYPEWRITER EFFECT ───────────────────────────────────
  (function typewriter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = document.getElementById('typewriter');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) { el.textContent += text[i]; i++; setTimeout(type, 100 + Math.random() * 80); }
    }
    setTimeout(type, 500);
  })();

  // ── START ───────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
