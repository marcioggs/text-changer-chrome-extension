//TODO: Show badge with number of changed words.

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Replace text.
 * @param {String} text Text to be replaced
 */
function replaceText(text) {
    //TODO: Replace with words from options.html.
    return text.replaceAll('Google', 'Microsoft');
}

//TODO: What if Google is a value to an input? How to change only text.
document.body.innerHTML = replaceText(document.body.innerHTML)

/**
 * Indicates if the given text need to be changed.
 * @param text Text to inspect
 */
function hasTextToChange(text) {
    return typeof text == 'string' && text.indexOf("Google") >= 0;
}

/**
 * Start observing object for relevant changes.
 * @param {MutationObserver} observer Observer
 */
function startObserving(observer) {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter:  ["value"]});
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
      
    startObserving(observer);
});

startObserving(observer);