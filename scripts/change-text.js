//TODO: Show badge with number of changed words.

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Replace text.
 * @param text Text to be replaced
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
    return text.indexOf("Google") >= 0;
}

/*
const observer = new MutationObserver(function(mutations) {
    console.log('passou 2');
    document.body.innerHTML = document.body.innerHTML.replaceAll('Google', 'Microsoft');
});
observer.observe(document.body, { subtree: true, childList: true, characterData: true});

const observer2 = new MutationObserver(function(mutations) {
    //TODO: Filtrar apenas input
    console.log('passou 3');
    document.body.innerHTML = document.body.innerHTML.replaceAll('Google', 'Microsoft');
});
observer2.observe(document.body, { subtree: true,  childList: true, attributes: true, attributeFilter:  ["value"]});
*/

/**
 * Start observing object for relevant changes.
 * @param observer Object to be observed
 */
function startObserving(observer) {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter:  ["value"]});
}

/**
 * Replaces text on input value attribute, that can be read on the page.
 * @param mutation Mutated node
 */
function replaceTextInInputValue(mutation) {
    if (mutation.target.nodeName.toUpperCase() == 'INPUT') {
        let text = mutation.target.getAttribute('value');
        if (hasTextToChange(text)) {
            mutation.target.setAttribute('value', replaceText(text));
        }
   }
}

/**
 * Replaces text in common text on page.
 * @param mutation Mutated node
 */
function replaceTextInCharacterData(mutation) {
    let data = mutation.target.data;
    if (hasTextToChange(data)) {
        mutation.target.replaceData(0, data.length, replaceText(data));
    }
}

const observer = new MutationObserver(function(mutations) {
    //The observer is disconnected to prevent infinite loop while changing text.
    observer.disconnect();

    mutations.forEach((mutation) => {
        switch(mutation.type) {
            case 'childList':
              /* One or more children have been added to and/or removed
                 from the tree; see mutation.addedNodes and
                 mutation.removedNodes */
                 //TODO: Change text on new child, on text and input value
                break;
            case 'attributes':
                debugger;
                replaceTextInInputValue(mutation);
                break;
            case 'characterData':
                replaceTextInCharacterData(mutation);
                break;
          }
      });
      
    startObserving(observer);
});

startObserving(observer);

