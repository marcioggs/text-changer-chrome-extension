/**
 * Saves the preferences to chrome.storage.
 */
function save_options() {
    var fromText = document.getElementById('fromText').value;
    var toText = document.getElementById('toText').value;

    chrome.storage.sync.set({
      fromText,
      toText
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);  
    });
  }
  
  /**
   * Restores preferences from chrome.storage.
   */
  function restore_options() {
    chrome.storage.sync.get({
        fromText: '',
        toText: ''
    }, function(items) {
      document.getElementById('fromText').value = items.fromText;
      document.getElementById('toText').value = items.toText;
    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);
