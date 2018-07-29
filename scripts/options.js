/**
 * Saves the preferences to chrome.storage.
 */
function savePreferences() {
    var fromText = document.getElementById('fromText').value;
    var toText = document.getElementById('toText').value;
    var hideBadge = document.getElementById('hideBadge').checked;

    chrome.storage.sync.set({
      fromText,
      toText,
      hideBadge
    }, updateSavedStatus);

    chrome.runtime.sendMessage({
        type: 'hideBadge',
        hideBadge: hideBadge
    });
  }

/**
 * Update status to let user know options were saved.
 */
function updateSavedStatus() {
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 750);  
}
  
/**
 * Restores preferences from chrome.storage.
 */
function restorePreferences() {
    chrome.storage.sync.get(function(items) {
        document.getElementById('fromText').value = items.fromText;
        document.getElementById('toText').value = items.toText;
        document.getElementById('hideBadge').checked = items.hideBadge;
    });
}

document.addEventListener('DOMContentLoaded', restorePreferences);
document.getElementById('save').addEventListener('click', savePreferences);
