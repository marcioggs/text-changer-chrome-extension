/**
 * Returns if an object is empy or not.
 * @param {Object} obj Object
 */
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Sets default preferences.
 */
function setDefaultPreferences() {
    chrome.storage.sync.set({
        fromText: '',
        toText: '',
        hideBadge: false
    });
}

chrome.runtime.onInstalled.addListener(function(reason, previousVersion, id) {
    chrome.storage.sync.get(function(items) {
        if (isObjectEmpty(items)) {
            setDefaultPreferences();
        }
    });
});
