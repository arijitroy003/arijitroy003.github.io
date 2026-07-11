// desktop.js — Window Manager
const WindowManager = (() => {
  let zCounter = 10;
  const windows = new Map(); // appId -> { el, state, prevBounds }
  let cascadeOffset = 0;

  const APP_CONFIGS = {
    about:      { title: 'about.md',          w: 640, h: 480, icon: 'ℹ' },
    terminal:   { title: 'terminal.sh',       w: 700, h: 500, icon: '>_' },
    experience: { title: 'experience.json',   w: 720, h: 600, icon: '📄' },
    projects:   { title: 'projects/',         w: 760, h: 580, icon: '📁' },
    skills:     { title: 'skills.svg',        w: 800, h: 640, icon: '⚙' },
    blog:       { title: 'blog/',             w: 700, h: 550, icon: '📝' },
  };

  // ── Core Window Operations ──

  function open(appId) {
    const existing = windows.get(appId);
    if (existing) {
      if (existing.state === 'minimized') { restore(appId); return; }
      focus(appId);
      return;
    }

    const tpl = document.getElementById('tpl-' + appId);
    if (!tpl) return;

    const content = tpl.content.cloneNode(true);
    const el = createWindowEl(appId);
    el.querySelector('.window-body').appendChild(content);
    document.getElementById('window-layer').appendChild(el);

    windows.set(appId, { el, state: 'open', prevBounds: null });
    focus(appId);
    updateTaskbar();

    // App-specific wiring
    if (appId === 'skills') {
      setTimeout(() => { if (typeof initSkillsNetwork === 'function') initSkillsNetwork(); }, 150);
    } else if (appId === 'blog') {
      setTimeout(() => { if (typeof blogEngine !== 'undefined') blogEngine.load(); }, 100);
    } else if (appId === 'terminal') {
      wireTerminal(el.querySelector('.window-body'));
    }

    announce(APP_CONFIGS[appId].title + ' opened');

    // Focus first focusable element in body
    const focusable = el.querySelector('.window-body [tabindex], .window-body button, .window-body input, .window-body a, .window-body textarea, .window-body select');
    if (focusable) focusable.focus();
  }

  function close(appId) {
    const win = windows.get(appId);
    if (!win) return;
    if (win.el.classList.contains('closing')) return;

    if (appId === 'skills' && typeof cleanupSkillsNetwork === 'function') cleanupSkillsNetwork();

    if (win.state === 'minimized') {
      win.el.remove();
      windows.delete(appId);
      updateTaskbar();
      announce(APP_CONFIGS[appId].title + ' closed');
      return;
    }

    win.el.classList.add('closing');
    var removed = false;
    function removeWin() {
      if (removed) return;
      removed = true;
      win.el.remove();
      windows.delete(appId);
      updateTaskbar();
    }
    win.el.addEventListener('animationend', removeWin, { once: true });
    setTimeout(removeWin, 400);

    announce(APP_CONFIGS[appId].title + ' closed');
  }

  function minimize(appId) {
    const win = windows.get(appId);
    if (!win || win.state !== 'open') return;

    const taskBtn = document.querySelector('.taskbar-app-btn[data-app="' + appId + '"]');
    const winRect = win.el.getBoundingClientRect();
    const winCenterX = winRect.left + winRect.width / 2;
    const winCenterY = winRect.top + winRect.height / 2;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight;
    if (taskBtn) {
      const btnRect = taskBtn.getBoundingClientRect();
      targetX = btnRect.left + btnRect.width / 2;
      targetY = btnRect.top + btnRect.height / 2;
    }

    const dx = targetX - winCenterX;
    const dy = targetY - winCenterY;
    win.el.style.setProperty('--minimize-x', dx + 'px');
    win.el.style.setProperty('--minimize-y', dy + 'px');
    win.el.classList.add('minimizing');

    var minimized = false;
    function doMinimize() {
      if (minimized) return;
      minimized = true;
      win.el.style.display = 'none';
      win.state = 'minimized';
      updateTaskbar();
    }
    win.el.addEventListener('animationend', doMinimize, { once: true });
    setTimeout(doMinimize, 400);
  }

  function restore(appId) {
    const win = windows.get(appId);
    if (!win || win.state !== 'minimized') return;

    win.el.classList.remove('minimizing');
    win.el.style.display = '';
    win.state = 'open';

    // Re-trigger open animation
    win.el.style.animation = 'none';
    // Force reflow
    void win.el.offsetHeight;
    win.el.style.animation = '';

    focus(appId);
    updateTaskbar();
  }

  function maximize(appId) {
    const win = windows.get(appId);
    if (!win) return;

    if (win.el.classList.contains('maximized')) {
      // Restore from maximized
      if (win.prevBounds) {
        win.el.style.top = win.prevBounds.top;
        win.el.style.left = win.prevBounds.left;
        win.el.style.width = win.prevBounds.width;
        win.el.style.height = win.prevBounds.height;
      }
      win.el.classList.remove('maximized');
      win.prevBounds = null;
    } else {
      // Store current bounds and maximize
      win.prevBounds = {
        top: win.el.style.top,
        left: win.el.style.left,
        width: win.el.style.width,
        height: win.el.style.height,
      };
      win.el.classList.add('maximized');
    }
  }

  function focus(appId) {
    const win = windows.get(appId);
    if (!win) return;

    windows.forEach((w) => w.el.classList.remove('focused'));
    zCounter++;
    win.el.style.zIndex = zCounter;
    win.el.classList.add('focused');

    // Update taskbar active states
    document.querySelectorAll('.taskbar-app-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.app === appId);
    });
  }

  // ── Window Element Creation ──

  function createWindowEl(appId) {
    const config = APP_CONFIGS[appId];
    const top = 60 + cascadeOffset * 30;
    const left = 80 + cascadeOffset * 30;
    cascadeOffset = (cascadeOffset + 1) % 6;

    const el = document.createElement('div');
    el.className = 'window';
    el.dataset.app = appId;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', config.title);
    el.style.cssText = 'top:' + top + 'px;left:' + left + 'px;width:' + config.w + 'px;height:' + config.h + 'px;z-index:' + (++zCounter);

    el.innerHTML =
      '<div class="window-titlebar">' +
        '<div class="window-controls">' +
          '<button class="window-btn window-btn-close" aria-label="Close"></button>' +
          '<button class="window-btn window-btn-minimize" aria-label="Minimize"></button>' +
          '<button class="window-btn window-btn-maximize" aria-label="Maximize"></button>' +
        '</div>' +
        '<span class="window-title">' + config.title + '</span>' +
      '</div>' +
      '<div class="window-body"></div>';

    // Wire traffic light buttons
    el.querySelector('.window-btn-close').addEventListener('click', () => close(appId));
    el.querySelector('.window-btn-minimize').addEventListener('click', () => minimize(appId));
    el.querySelector('.window-btn-maximize').addEventListener('click', () => maximize(appId));

    // Focus on click anywhere in window
    el.addEventListener('mousedown', () => focus(appId));

    // Drag on titlebar
    setupDrag(el.querySelector('.window-titlebar'), el, appId);

    // Resize handle
    var rh = document.createElement('div');
    rh.className = 'window-resize-handle';
    el.appendChild(rh);
    setupResize(rh, el);

    return el;
  }

  // ── Drag ──

  function setupDrag(titlebar, windowEl, appId) {
    let dragging = false;
    let startX, startY, origLeft, origTop;
    let rafId = null;
    let moveX, moveY;

    titlebar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.window-btn')) return;

      // If maximized, unmaximize under cursor
      if (windowEl.classList.contains('maximized')) {
        const win = windows.get(appId);
        const prevW = win && win.prevBounds ? parseInt(win.prevBounds.width) : APP_CONFIGS[appId].w;
        maximize(appId); // toggles off
        // Position so cursor is proportionally placed on titlebar
        const fraction = e.clientX / window.innerWidth;
        windowEl.style.left = (e.clientX - prevW * fraction) + 'px';
        windowEl.style.top = e.clientY - 16 + 'px';
      }

      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = windowEl.offsetLeft;
      origTop = windowEl.offsetTop;

      windowEl.classList.add('dragging');
      titlebar.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    titlebar.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      moveX = origLeft + (e.clientX - startX);
      moveY = origTop + (e.clientY - startY);

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        // Clamp so at least 100px of window stays visible
        const wW = windowEl.offsetWidth;
        const wH = windowEl.offsetHeight;
        const vW = window.innerWidth;
        const vH = window.innerHeight;

        moveX = Math.max(-(wW - 100), Math.min(vW - 100, moveX));
        moveY = Math.max(0, Math.min(vH - 100, moveY));

        windowEl.style.left = moveX + 'px';
        windowEl.style.top = moveY + 'px';
        rafId = null;
      });
    });

    titlebar.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      windowEl.classList.remove('dragging');
      titlebar.releasePointerCapture(e.pointerId);
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    });
  }

  // ── Taskbar ──

  function updateTaskbar() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;
    container.innerHTML = '';

    windows.forEach((win, appId) => {
      const config = APP_CONFIGS[appId];
      const btn = document.createElement('button');
      btn.className = 'taskbar-app-btn';
      btn.dataset.app = appId;
      btn.setAttribute('role', 'tab');
      btn.textContent = config.icon + ' ' + config.title;

      if (win.state === 'open' && win.el.classList.contains('focused')) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        const w = windows.get(appId);
        if (!w) return;
        if (w.state === 'minimized') { restore(appId); return; }
        if (w.el.classList.contains('focused')) { minimize(appId); return; }
        focus(appId);
      });

      container.appendChild(btn);
    });
  }

  // ── Resize ──

  function setupResize(handle, windowEl) {
    var resizing = false, startX, startY, startW, startH;

    handle.addEventListener('pointerdown', function(e) {
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = windowEl.offsetWidth; startH = windowEl.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      windowEl.classList.add('dragging');
      e.stopPropagation(); e.preventDefault();
    });

    handle.addEventListener('pointermove', function(e) {
      if (!resizing) return;
      windowEl.style.width = Math.max(320, startW + e.clientX - startX) + 'px';
      windowEl.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
    });

    handle.addEventListener('pointerup', function(e) {
      resizing = false;
      windowEl.classList.remove('dragging');
      handle.releasePointerCapture(e.pointerId);
    });
  }

  // ── Accessibility ──

  function announce(msg) {
    const el = document.getElementById('sr-announcer');
    if (!el) return;
    el.textContent = msg;
    setTimeout(() => { el.textContent = ''; }, 1000);
  }

  // ── Boot Sequence ──

  function initBoot() {
    const boot = document.getElementById('boot-screen');
    const fill = document.getElementById('boot-progress-fill');
    const status = document.getElementById('boot-status');
    const desktop = document.getElementById('desktop');

    if (!boot || !desktop) return;

    // Skip boot if already seen this session
    try { if (sessionStorage.getItem('booted')) {
      boot.remove();
      desktop.style.display = '';
      onDesktopReady();
      return;
    } } catch(e) { /* private mode */ }

    const steps = [
      { pct: 20,  msg: 'loading kernel...' },
      { pct: 50,  msg: 'initializing window manager...' },
      { pct: 80,  msg: 'mounting career highlights...' },
      { pct: 100, msg: 'ready.' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          boot.classList.add('done');
          desktop.style.display = '';
          try { sessionStorage.setItem('booted', '1'); } catch(e) {}
          setTimeout(() => { boot.remove(); onDesktopReady(); }, 600);
        }, 400);
        return;
      }
      fill.style.width = steps[i].pct + '%';
      status.textContent = steps[i].msg;
      i++;
    }, 350);
  }

  function onDesktopReady() {
    initDesktopIcons();
    initClock();
    initKeyboard();
    // ponytail: no auto-open — let the user explore the desktop
  }

  function initDesktopIcons() {
    var container = document.getElementById('desktop-icons');
    if (!container) return;
    container.querySelectorAll('.desktop-icon').forEach(setupIconDrag);
  }

  function setupIconDrag(icon) {
    var startX, startY, offsetX = 0, offsetY = 0, moved = false, captured = false;

    icon.addEventListener('pointerdown', function(e) {
      startX = e.clientX; startY = e.clientY;
      moved = false; captured = true;
      icon.setPointerCapture(e.pointerId);
      icon.classList.add('icon-dragging');
      e.preventDefault();
    });

    icon.addEventListener('pointermove', function(e) {
      if (!captured) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
      icon.style.transform = 'translate(' + (offsetX + dx) + 'px,' + (offsetY + dy) + 'px)';
    });

    icon.addEventListener('pointerup', function(e) {
      if (!captured) return;
      if (moved) { offsetX += e.clientX - startX; offsetY += e.clientY - startY; }
      captured = false;
      icon.releasePointerCapture(e.pointerId);
      icon.classList.remove('icon-dragging');
    });

    icon.addEventListener('dblclick', function() { if (!moved) open(icon.dataset.app); });

    if ('ontouchstart' in window) {
      icon.addEventListener('click', function() { if (!moved) open(icon.dataset.app); });
    }
  }

  function initClock() {
    const el = document.getElementById('taskbar-clock');
    if (!el) return;
    function tick() {
      el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);
  }

  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // If article overlay is open, let script.js handle it
        var overlay = document.getElementById('article-overlay');
        if (overlay && overlay.classList.contains('open')) return;

        // Find topmost open window
        let topApp = null;
        let topZ = -1;
        windows.forEach((w, id) => {
          if (w.state === 'open') {
            const z = parseInt(w.el.style.zIndex) || 0;
            if (z > topZ) { topZ = z; topApp = id; }
          }
        });
        if (topApp) close(topApp);
      }
    });
  }

  // ── Terminal Wiring ──

  function wireTerminal(windowBody) {
    const sendBtn = windowBody.querySelector('.chat-send');
    if (sendBtn) sendBtn.addEventListener('click', () => { if (typeof sendMessage === 'function') sendMessage(); });

    const chatInput = windowBody.querySelector('#chat-input');
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { if (typeof sendMessage === 'function') sendMessage(); } });

    const quickBtns = windowBody.querySelectorAll('.chat-quick-btn');
    quickBtns.forEach(btn => {
      const topic = btn.getAttribute('data-topic') || btn.textContent;
      btn.addEventListener('click', () => { if (typeof sendQuickReply === 'function') sendQuickReply(topic); });
    });

    const llmToggle = windowBody.querySelector('#llm-toggle');
    if (llmToggle) llmToggle.addEventListener('click', () => { if (typeof toggleLLM === 'function') toggleLLM(); });
  }

  // ── Init ──

  document.addEventListener('DOMContentLoaded', initBoot);

  return { open, close, minimize, maximize, focus, init: initBoot };
})();
