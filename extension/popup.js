document.getElementById('openApp').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['appUrl'], (result) => {
    chrome.tabs.create({ url: result.appUrl || 'http://localhost:5173/game' });
  });
});

document.getElementById('openOptions').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});
