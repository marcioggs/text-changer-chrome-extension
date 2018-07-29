$(document).ready(function() {
    restorePreferences();

    $('#save').click(savePreferences);
    $('#addEntry').click(addTextChangeEntry);
    $('#removeEntry').click(removeTextChangeEntry);
});

/**
 * Restores preferences from chrome.storage.
 */
function restorePreferences() {
    chrome.storage.sync.get(function(items) {
        for (let i = 0; i < items.fromTextArray.length; i++) {
            let firstRow = $('#entriesList').find('div:first');
            let row = (i == 0)? firstRow : firstRow.clone();

            row.find('[name="fromText"]').val(items.fromTextArray[i]);
            row.find('[name="toText"]').val(items.toTextArray[i]);

            if (i > 0) {
                $('#entriesList').find('div:last').after(row);
            }
        }

        $('#hideBadge').prop('checked', items.hideBadge)
        updateRemoveButton();
    });
}

/**
 * Saves the preferences to chrome.storage.
 */
function savePreferences() {
    let fromTextArray = $('[name="fromText"]').map(function() { return $(this).val()}).toArray();
    let toTextArray = $('[name="toText"]').map(function() { return $(this).val()}).toArray();
    let hideBadge = $('#hideBadge').prop('checked');

    if (thereIsEmptyElement(fromTextArray.concat(toTextArray))) {
        showStatus('All fields should be filled.');
        return;
    }

    chrome.storage.sync.set({
        fromTextArray,
        toTextArray,
        hideBadge
    }, function() {
        showStatus('Saved.');
    });

    chrome.runtime.sendMessage({
        type: 'hideBadge',
        hideBadge: hideBadge
    });
}

/**
 * Indicates that a element of the array is empty.
 * @param {Array} arr Array to be tested
 */
function thereIsEmptyElement(arr) {
    let reducer = (accumulator, current) => accumulator || current === '';
    return arr.reduce(reducer, false);
}

/**
 * Update status to let user know options were saved.
 */
function showStatus(text) {
    let status = $('#status');
    status.text(text);
    setTimeout(function() {
        status.text('');
    }, 750);  
}
  
/**
 * Disable Remove button if there is only one row, otherwise enable it.
 */
function updateRemoveButton() {
    let disabled = false
    if ($('#entriesList').find('div').length == 1) {
        disabled = true;   
    }
    $('#removeTextChange').prop('disabled', disabled);
}

/**
 * Adds a new from/to row to the end of the list.
 */
function addTextChangeEntry() {
    let lastRow = $('#entriesList').find('div:last');
    let newRow = $('#entriesList').find('div:first').clone();

    newRow.find('[name="fromText"]').val('');
    newRow.find('[name="toText"]').val('');

    lastRow.after(newRow);
    updateRemoveButton();
}

/**
 * Removes the last from/to row.
 */
function removeTextChangeEntry() {
    $('#entriesList').find('div:last').remove();
    updateRemoveButton();
}
