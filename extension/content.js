/**
 * ScrollShield - Content script for doomscroll detection
 * Runs on TikTok, Instagram, YouTube. Shows interruption after 30 seconds on page.
 */

(function () {
  const THRESHOLD_PAGE_TIME_MS = 30 * 1000;
  const CHECK_INTERVAL_MS = 5000;

  let pageLoadTime = Date.now();
  let overlayShown = false;

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
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#scrollshield-start').addEventListener('click', () => {
      chrome.storage.sync.get(['appUrl'], (result) => {
        const url = result.appUrl || 'http://localhost:5173/game';
        window.location.href = url;
      });
    });
  }

  function checkTimeOnPage() {
    if (overlayShown) return;
    if (Date.now() - pageLoadTime >= THRESHOLD_PAGE_TIME_MS) {
      trigger();
    }
  }

  setInterval(checkTimeOnPage, CHECK_INTERVAL_MS);
})();
