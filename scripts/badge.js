chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 255]});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.type) {
            case 'updateBadge':
                updateBadge(request, sender, sendResponse);
                break;
            case 'hideBadge':
                hideBadge(request, sender, sendResponse);
                break;
        }
    }
);

/**
 * Updates badge.
 * @param {any} request Request injected by addListener.
 * @param {runtime.MessageSender} sender Sender injected by addListener.
 * @param {function} sendResponse Send Response injected by addListener.
 */
function updateBadge(request, sender, sendResponse) {
    chrome.storage.sync.get(function(items) {
        if (!items.hideBadge) {
            chrome.tabs.get(sender.tab.id, function(tab) {
                chrome.browserAction.setBadgeText({
                    tabId: tab.id,
                    text: request.quantityChanged
                });
            });
        }
    });
}

/**
 * Hides badge.
 * @param {any} request Request injected by addListener.
 * @param {runtime.MessageSender} sender Sender injected by addListener.
 * @param {function} sendResponse Send Response injected by addListener.
 */
function hideBadge(request, sender, sendResponse) {
    if (request.hideBadge) {
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(tab => {
                chrome.browserAction.setBadgeText({
                    text: '',
                    tabId: tab.id
                });        
            });
        });
    }
}
