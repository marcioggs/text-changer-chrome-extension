// Saves options to chrome.storage
function save_options() {
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;

    chrome.storage.sync.set({
      from: from,
      to: to
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      from: 'Microsoft',
      to: 'Google'
    }, function(items) {
      document.getElementById('from').value = items.from;
      document.getElementById('to').value = items.to;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);
      