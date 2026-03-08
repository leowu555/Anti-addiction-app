/**
 * ScrollShield - Content script for doomscroll detection
 * Runs on TikTok, Instagram, YouTube. Detects excessive scroll/time and shows interruption.
 */

(function () {
  const THRESHOLD_TIME_MS = 45 * 1000;
  const THRESHOLD_SCROLL_PX = 2500;
  const THRESHOLD_PAGE_TIME_MS = 45 * 1000;
  const IDLE_RESET_MS = 2000;

  let scrollStartTime = null;
  let pageLoadTime = Date.now();
  let totalScrollPx = 0;
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  let lastScrollByEl = new WeakMap();
  let idleTimeout = null;
  let overlayShown = false;

  function reset() {
    scrollStartTime = null;
    totalScrollPx = 0;
    if (idleTimeout) {
      clearTimeout(idleTimeout);
      idleTimeout = null;
    }
    lastScrollY = window.scrollY;
  }

  function getScrollTop(el) {
    if (!el || el === document) return window.scrollY;
    return el.scrollTop !== undefined ? el.scrollTop : window.scrollY;
  }

  function getDelta(el) {
    const isWindow = !el || el === document || el === document.documentElement;
    const current = getScrollTop(el);
    const last = isWindow ? lastScrollY : (lastScrollByEl.get(el) ?? 0);
    if (isWindow) lastScrollY = current;
    else lastScrollByEl.set(el, current);
    return Math.abs(current - last);
  }

  function trigger() {
    if (overlayShown) return;
    overlayShown = true;
    showOverlay();
  }

  function showOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'scrollshield-overlay';
    overlay.innerHTML = `
      <div class="scrollshield-backdrop"></div>
      <div class="scrollshield-modal">
        <h2>You're doomscrolling.</h2>
        <p>Let's turn this into brain training.</p>
        <button id="scrollshield-start" class="scrollshield-btn">Start 2-Back Challenge</button>
        <button id="scrollshield-dismiss" class="scrollshield-dismiss">Maybe later</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#scrollshield-start').addEventListener('click', () => {
      chrome.storage.sync.get(['appUrl'], (result) => {
        const url = result.appUrl || 'http://localhost:5173/game';
        window.location.href = url;
      });
    });

    overlay.querySelector('#scrollshield-dismiss').addEventListener('click', () => {
      overlay.remove();
      overlayShown = false;
      reset();
    });
  }

  function handleScroll(ev) {
    if (overlayShown) return;

    const el = ev && ev.target ? ev.target : document.documentElement;
    const now = Date.now();
    const delta = getDelta(el);

    if (scrollStartTime === null) {
      scrollStartTime = now;
    }

    totalScrollPx += delta;
    const elapsed = now - scrollStartTime;

    if (elapsed >= THRESHOLD_TIME_MS || totalScrollPx >= THRESHOLD_SCROLL_PX) {
      trigger();
      return;
    }

    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(reset, IDLE_RESET_MS);
  }

  function attachToScrollables() {
    const scrollables = document.querySelectorAll(
      'div[style*="overflow:scroll"], div[style*="overflow:auto"], [class*="scroll"]'
    );
    scrollables.forEach((el) => {
      if (el.scrollHeight > el.clientHeight && !el.dataset.scrollshield) {
        el.dataset.scrollshield = '1';
        el.addEventListener('scroll', handleScroll, { passive: true });
      }
    });
  }

  function recordActivity(delta) {
    if (overlayShown) return;
    if (scrollStartTime === null) scrollStartTime = Date.now();
    if (delta) totalScrollPx += delta;
    const elapsed = Date.now() - scrollStartTime;
    if (elapsed >= THRESHOLD_TIME_MS || totalScrollPx >= THRESHOLD_SCROLL_PX) {
      trigger();
    }
  }

  function checkTimeOnPage() {
    if (overlayShown) return;
    if (Date.now() - pageLoadTime >= THRESHOLD_PAGE_TIME_MS) {
      trigger();
    }
  }

  window.addEventListener('scroll', (e) => handleScroll(e || { target: document.documentElement }), { passive: true });
  window.addEventListener('wheel', () => recordActivity(100), { passive: true });
  window.addEventListener('touchmove', () => recordActivity(50), { passive: true });

  if (document.readyState === 'complete') {
    setTimeout(attachToScrollables, 2000);
    setTimeout(() => setInterval(attachToScrollables, 5000), 3000);
  }
  window.addEventListener('load', () => {
    setTimeout(attachToScrollables, 2000);
    setTimeout(() => setInterval(attachToScrollables, 5000), 3000);
  });

  setInterval(checkTimeOnPage, 10000);
})();
