/**
 * Turn a NodeList into an array with it's values.
 */
function turnIntoArrayOfValues(nodeList) {
    return Array.from(nodeList).map(node => node.value);
}

/**
 * Saves the preferences to chrome.storage.
 */
function savePreferences() {
    let fromTextArray = turnIntoArrayOfValues(document.getElementsByName('fromText'));
    let toTextArray = turnIntoArrayOfValues(document.getElementsByName('toText'));
    let hideBadge = document.getElementById('hideBadge').checked;

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
 * Restores preferences from chrome.storage.
 */
function restorePreferences() {
    chrome.storage.sync.get(function(items) {
        for (let i = 0; i < items.fromTextArray.length; i++) {
            let firstRow = $('#fromToList').find('div:first');
            let row = (i == 0)? firstRow : firstRow.clone();

            row.find('[name="fromText"]').val(items.fromTextArray[i]);
            row.find('[name="toText"]').val(items.toTextArray[i]);

            if (i > 0) {
                $('#fromToList').find('div:last').after(row);
            }
        }

        document.getElementById('hideBadge').checked = items.hideBadge;
        updateRemoveButton();
    });
}

/**
 * Adds a new from/to row to the end of the list.
 */
$('#addTextChange').click(function() {
    let lastRow = $('#fromToList').find('div:last');
    let newRow = $('#fromToList').find('div:first').clone();

    newRow.find('[name="fromText"]').val('');
    newRow.find('[name="toText"]').val('');

    lastRow.after(newRow);
    updateRemoveButton();
});

/**
 * Removes the last from/to row.
 */
$('#removeTextChange').click(function() {
    $('#fromToList').find('div:last').remove();
    updateRemoveButton();
});

/**
 * Disable Remove button if there is only one row, otherwise enable it.
 */
function updateRemoveButton() {
    let disabled = false
    if ($('#fromToList').find('div').length == 1) {
        disabled = true;   
    }
    $('#removeTextChange').prop('disabled', disabled);
}

document.addEventListener('DOMContentLoaded', restorePreferences);
document.getElementById('save').addEventListener('click', savePreferences);
