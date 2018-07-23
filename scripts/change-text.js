String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//TODO: Replace with words from options.html.
document.body.innerHTML = document.body.innerHTML.replaceAll('Google', 'Microsoft');

//TODO: Show badge with number of changed words.
//TODO: Certify that words are change when pages are modified dinamically.
