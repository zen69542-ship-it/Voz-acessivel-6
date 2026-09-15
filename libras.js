
document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;
  const data = window.LibrasContent || [];

  function motionOff() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReduced || root.classList.contains('reduce-motion') || root.classList.contains('epilepsy-safe');
  }

    const PREF_KEY = 'convive-libras-prefs';
  function loadLibrasPrefs() {
    try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveLibrasPrefs(prefs) {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {}
  }
  let prefs = Object.assign({ size: 'md', position: 'br', autoplay: 'manual', speed: '1' }, loadLibrasPrefs());

    const panel = document.getElementById('librasPanel');
  if (!panel) return; // página sem o módulo incluído

  const stage = document.getElementById('lpStage');
  const caption = document.getElementById('lpCaption');
  const video = document.getElementById('lpVideo');
  const btnClose = document.getElementById('lpClose');
  const btnMin = document.getElementById('lpMinimize');
  const btnSettingsToggle = document.getElementById('lpSettingsToggle');
  const settingsBox = document.getElementById('lpSettings');
  const btnPlay = document.getElementById('lpPlay');
  const btnRestart = document.getElementById('lpRestart');
  const btnFullscreen = document.getElementById('lpFullscreen');
  const progressBar = document.getElementById('lpProgress');
  const progressFill = document.getElementById('lpProgressFill');
  const speedBtn = document.getElementById('lpSpeedBtn');
  const header = panel.querySelector('.lp-header');

  const speeds = ['0.75', '1', '1.25', '1.5'];

  function applySizeClass() {
    panel.classList.remove('size-sm', 'size-md', 'size-lg');
    panel.classList.add('size-' + prefs.size);
  }
  function applyPositionClass() {
    panel.classList.remove('pos-br', 'pos-bl', 'pos-tr');
    panel.classList.add('pos-' + prefs.position);
  }
  applySizeClass();
  applyPositionClass();
  if (video) video.playbackRate = parseFloat(prefs.speed);
  if (speedBtn) speedBtn.textContent = prefs.speed + 'x';

  document.querySelectorAll('.lp-set-row [data-libras-size]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.librasSize === prefs.size);
    btn.addEventListener('click', () => {
      prefs.size = btn.dataset.librasSize;
      saveLibrasPrefs(prefs);
      applySizeClass();
      document.querySelectorAll('[data-libras-size]').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('.lp-set-row [data-libras-pos]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.librasPos === prefs.position);
    btn.addEventListener('click', () => {
      prefs.position = btn.dataset.librasPos;
      saveLibrasPrefs(prefs);
      applyPositionClass();
      document.querySelectorAll('[data-libras-pos]').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('.lp-set-row [data-libras-play]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.librasPlay === prefs.autoplay);
    btn.addEventListener('click', () => {
      prefs.autoplay = btn.dataset.librasPlay;
      saveLibrasPrefs(prefs);
      document.querySelectorAll('[data-libras-play]').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      const i = speeds.indexOf(prefs.speed);
      prefs.speed = speeds[(i + 1) % speeds.length];
      saveLibrasPrefs(prefs);
      speedBtn.textContent = prefs.speed + 'x';
      if (video) video.playbackRate = parseFloat(prefs.speed);
    });
  }

  if (btnSettingsToggle) {
    btnSettingsToggle.addEventListener('click', () => {
      const open = settingsBox.classList.toggle('open');
      btnSettingsToggle.setAttribute('aria-expanded', String(open));
    });
  }

    let lastFocused = null;

  function loadContent(id) {
    const item = data.find(d => d.id === id);
    if (!item) return;

    document.getElementById('lpTitle').textContent = item.title;
    caption.innerHTML = '<strong>' + item.title + '</strong>' + item.textOriginal;

    if (item.status === 'ready' && item.videoUrl) {
      stage.innerHTML = '';
      const v = document.createElement('video');
      v.id = 'lpVideo';
      v.setAttribute('playsinline', '');
      v.setAttribute('preload', 'none');
      v.src = item.videoUrl;
      v.controls = false;
      stage.appendChild(v);
      if (prefs.autoplay === 'auto' && !motionOff()) v.play().catch(() => {});
    } else {
      stage.innerHTML = '<div class="lp-placeholder"><svg class="lt-icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#inclusion-icon" xlink:href="#inclusion-icon"></use></svg><p>Conteúdo em Libras em preparação.</p></div>';
    }
  }

  function openPanel(id) {
    lastFocused = document.activeElement;
    panel.classList.add('open');
    panel.classList.remove('minimized');
    panel.setAttribute('aria-hidden', 'false');
    if (id) loadContent(id);
    document.querySelectorAll('.libras-trigger').forEach(t => t.classList.toggle('active', t.dataset.librasId === id));
    setTimeout(() => btnClose && btnClose.focus(), 30);
    document.addEventListener('keydown', trapFocus);
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.libras-trigger.active').forEach(t => t.classList.remove('active'));
    document.removeEventListener('keydown', trapFocus);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function trapFocus(e) {
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    const focusables = panel.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

    document.querySelectorAll('.libras-trigger, [data-libras-open]').forEach(trigger => {
    trigger.addEventListener('click', () => openPanel(trigger.dataset.librasId));
  });

  const openBtn = document.getElementById('librasOpenBtn');
  if (openBtn) openBtn.addEventListener('click', () => {
    const a11yPanel = document.getElementById('a11yPanel');
    if (a11yPanel) a11yPanel.classList.remove('open');
    const a11yScrimEl = document.getElementById('a11yScrim');
    if (a11yScrimEl) a11yScrimEl.classList.remove('active');
    if (window.conviveUnlockScroll) { window.conviveUnlockScroll(); } else { document.body.classList.remove('modal-open'); }
    const fab = document.getElementById('a11yFab');
    if (fab) fab.setAttribute('aria-expanded', 'false');
    openPanel('slogan');
  });

    const glossaryEl = document.getElementById('librasGlossary');
  if (glossaryEl && window.LibrasGlossary) {
    glossaryEl.innerHTML = window.LibrasGlossary.map(item => (
      '<div class="lg-card">' +
        '<div class="lg-word">' + item.termo + '</div>' +
        '<div class="lg-mean">' + item.significado + '</div>' +
        '<div class="lg-status">' + (item.videoUrl ? 'Vídeo disponível' : 'Vídeo em preparação') + '</div>' +
      '</div>'
    )).join('');
  }

  if (btnClose) btnClose.addEventListener('click', closePanel);
  if (btnMin) btnMin.addEventListener('click', () => {
    const min = panel.classList.toggle('minimized');
    btnMin.setAttribute('aria-label', min ? 'Expandir painel de Libras' : 'Minimizar painel de Libras');
  });

    if (btnPlay) btnPlay.addEventListener('click', () => {
    const v = document.getElementById('lpVideo');
    if (!v) return;
    if (v.paused) { v.play(); btnPlay.textContent = '⏸'; btnPlay.setAttribute('aria-label', 'Pausar'); }
    else { v.pause(); btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-label', 'Reproduzir'); }
  });
  if (btnRestart) btnRestart.addEventListener('click', () => {
    const v = document.getElementById('lpVideo');
    if (v) v.currentTime = 0;
  });
  if (btnFullscreen) btnFullscreen.addEventListener('click', () => {
    const v = document.getElementById('lpVideo');
    if (v && v.requestFullscreen) v.requestFullscreen();
  });
  if (progressBar) {
    stage.addEventListener('timeupdate', (e) => {
      if (e.target.tagName !== 'VIDEO' || !e.target.duration) return;
      progressFill.style.width = (e.target.currentTime / e.target.duration * 100) + '%';
    }, true);
    progressBar.addEventListener('click', (e) => {
      const v = document.getElementById('lpVideo');
      if (!v || !v.duration) return;
      const rect = progressBar.getBoundingClientRect();
      v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
    });
  }

    if (header && window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !document.documentElement.classList.contains('motor-gestures')) {
    let dragging = false, offX = 0, offY = 0;
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      dragging = true;
      const r = panel.getBoundingClientRect();
      offX = e.clientX - r.left; offY = e.clientY - r.top;
      panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px';
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, e.clientX - offX)) + 'px';
      panel.style.top = Math.max(8, Math.min(window.innerHeight - 60, e.clientY - offY)) + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; });
  }
});
