/**
 * ScrollShield - Background service worker
 * Manages storage and default app URL.
 */

const DEFAULT_APP_URL = 'http://localhost:5173/game';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['appUrl'], (result) => {
    if (!result.appUrl) {
      chrome.storage.sync.set({ appUrl: DEFAULT_APP_URL });
    }
  });
});
