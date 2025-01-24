function getAllTextNodes(node) {
    var nodes = [];
    if(node) {
        node = node.firstChild;
        while(node != null) {
			if (['SCRIPT','STYLE'].indexOf(node.tagName) >= 0) {
				node = node.nextSibling;
				continue;
			}
			if (node.nodeType == Node.TEXT_NODE) nodes[nodes.length] = node;
            else nodes = nodes.concat(getAllTextNodes(node));
			
			node = node.nextSibling;
        }
    }
    return nodes;
}

function capitalized(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizedAll(str) {
	return str.split(" ").map(word => capitalized(word)).join(" ");
}

function rewriteTextNodesContents(textNodes) {
  if (!textNodes) {
  	return;
  }
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent;

    const re = new RegExp(Object.keys(replacements).join((matchWholeWord ? "\\b|\\b" : "|")), "gi");
    
    
    let newText = text.replace(re, function(matched) {
      if (matched == matched.toUpperCase()) {
        return replacements[matched.toLowerCase()].toUpperCase();
      }
      if (matched == capitalizedAll(matched)) {
        return capitalizedAll(replacements[matched.toLowerCase()]);
      }
      if (matched == capitalized(matched)) {
        return capitalized(replacements[matched.toLowerCase()]);
      }
      return replacements[matched.toLowerCase()];
    });
    textNodes[i].textContent = newText;
  }
}

function resetTextNodesContents(textNodes) {
  for (let i = 0; i < originalTextNodes.length; i++) {
    textNodes[i].textContent = originalTextNodes[i].textContent;
  }
}

const textNodes = getAllTextNodes(document.body);
textNodes.push(document.querySelector("title"));

const originalTextNodes = [];
for (let i = 0; i < textNodes.length; i++) {
  originalTextNodes.push(textNodes[i].cloneNode(true));
}

let replacements;
let matchWholeWord;

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
  if (Object.keys(changes).indexOf("matchWholeWord") != -1) {
    matchWholeWord = changes["matchWholeWord"].newValue;
    resetTextNodesContents(textNodes);
    rewriteTextNodesContents(textNodes);
  }
});

chrome.storage.local.get('replacements').then((result) => {
  replacements = result.replacements;
  
  chrome.storage.local.get('matchWholeWord').then((result) => {
    matchWholeWord = result.matchWholeWord;
    
    rewriteTextNodesContents(textNodes);
  });
});
