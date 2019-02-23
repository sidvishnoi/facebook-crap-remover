function saveOptions() {
  const keywords = document.getElementById('keywords').value
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
    .sort();
  chrome.storage.sync.set({ keywords }, () => {
    restoreOptions();
    const status = document.getElementById('save');
    status.textContent = 'Saved.';
    setTimeout(() => {
      status.textContent = 'Save';
    }, 1000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ keywords: [] }, result => {
    document.getElementById('keywords').value = result.keywords.join(',');
  });
  chrome.storage.local.get({ count: 0 }, result => {
    document.getElementById('stats').textContent = result.count;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('form').addEventListener('submit', ev => {
  ev.preventDefault();
  saveOptions();
  document.getElementById('keywords').focus();
})
