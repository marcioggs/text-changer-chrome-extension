chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 255]});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.tabs.get(sender.tab.id, function(tab) {
            chrome.browserAction.setBadgeText({tabId: tab.id, text: request.quantityChanged});
        });
    }
);
