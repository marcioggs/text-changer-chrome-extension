//TODO: Let the user turn off the badge.
//TODO: Beautify preference's page.
//TODO: Let the user add more words.

let fromText;
let toText;
let quantityChanged = 0;

/**
 * Restore the text to be changed.
 */
function restoreTextToChange() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get(function(items) {
            fromText = items.fromText;
            toText = items.toText;
            
            (fromText && toText)? resolve() : reject();
        });
    });    
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Replace text.
 * @param {String} text Text to be replaced
 */
function replaceText(text) {
    quantityChanged++;
    return text.replaceAll(fromText, toText);
}

/**
 * Indicates if the given text need to be changed.
 * @param {String} text Text to inspect
 */
function hasTextToChange(text) {
    return typeof text == 'string' && text.indexOf(fromText) >= 0;
}

/**
 * Replaces text on input value attribute, that can be read on the page.
 * @param {Node} node Node to search text to change
 */
function replaceTextInInputValue(node) {
    if (node.nodeName.toUpperCase() == 'INPUT') {
        let text = node.getAttribute('value');
        if (hasTextToChange(text)) {
            node.setAttribute('value', replaceText(text));
        }
   }
}

/**
 * Replaces text in common text on page.
 * @param {Node} node Node to search text to change
 */
function replaceTextInCharacterData(node) {
    let data = node.data;
    if (hasTextToChange(data)) {
        node.replaceData(0, data.length, replaceText(data));
    }
}

/**
 * Replaces text on added nodes and on their children recursively.
 * @param {NodeList} nodes Nodes
 */
function replaceTextOnNodes(nodes) {
    nodes.forEach((node) => {
        replaceTextInCharacterData(node);
        replaceTextInInputValue(node);
        node.childNodes.forEach((childNode) => {
            replaceTextInCharacterData(childNode);
            replaceTextInInputValue(childNode);
            if (typeof childNode.childNodes == 'object') {
                replaceTextOnNodes(childNode.childNodes);
            }
        });
    });
}

/**
 * Replaces text on the first page load.
 */
function replaceTextOnPageLoad() {
    replaceTextOnNodes(document.querySelectorAll('body'));
    updateBadge();
}

/**
 * Start observing object for relevant changes.
 * @param {MutationObserver} observer Observer
 */
function startObserving(observer) {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter:  ["value"]});
}

/**
 * Replaces text when the page change.
 */
function replaceTextOnPageChange() {
    const observer = new MutationObserver(function(mutations) {
        //The observer is disconnected to prevent infinite loop while changing text.
        observer.disconnect();
    
        mutations.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    replaceTextOnNodes(mutation.addedNodes);
                    break;
                case 'attributes':
                    replaceTextInInputValue(mutation.target);
                    break;
                case 'characterData':
                    replaceTextInCharacterData(mutation.target);
                    break;
              }
          });
          
        updateBadge();
        startObserving(observer);
    });
    
    startObserving(observer);
}

/**
 * Updates badge.
 */
function updateBadge() {
    chrome.runtime.sendMessage({
        type: 'updateBadge',
        quantityChanged: '' + quantityChanged
    });
}

restoreTextToChange()

.then(function() {
    replaceTextOnPageLoad();
    replaceTextOnPageChange();
})

.catch(function() {});
