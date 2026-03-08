document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('appUrl').value.trim();
  chrome.storage.sync.set({ appUrl: url || 'http://localhost:5173/game' }, () => {
    document.getElementById('status').textContent = 'Saved.';
  });
});

chrome.storage.sync.get(['appUrl'], (result) => {
  document.getElementById('appUrl').value = result.appUrl || 'http://localhost:5173/game';
});
