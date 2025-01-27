function getAllTextNodes(node) {
  var nodes = [];
  
  if (node) {
    node = node.firstChild;
    while(node != null) {
      if (["SCRIPT", "STYLE", "SOURCE"].indexOf(node.tagName) >= 0) {
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

function sortReplacementEntries(a, b) {
  if(a[0] < b[0]) { return 1; }
  if(a[0] > b[0]) { return -1; }
  return 0;
}

function rewriteTextNodesContents(textNodes) {
  if (!textNodes) {
    return;
  }
  if (Object.keys(replacements).length == 0) {
    return;
  }
  
  let replacementEntries = Object.entries(replacements);
  
  if (converseSubstitutions) {
    replacementEntries = replacementEntries.concat(replacementEntries.map((a) => [a[1], a[0]]));
  }
  
  replacementEntries.sort(sortReplacementEntries);
  
  if (escapeRegexCharacters) {
    for (let i = 0; i < replacementEntries.length; i++) {
      replacementEntries[i][0] = replacementEntries[i][0].replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&")
      replacementEntries[i][1] = replacementEntries[i][1].replace(/\$/g, '$$$$');
    }
  }

  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent;
    const matches = {};
    for (const [key, value] of replacementEntries) {
      const entryMatch = [...text.matchAll(new RegExp((matchWholeWord ? `\\b${key}\\b` : key), (caseInsensitive ? "gim" : "gm")))];
      for (match of entryMatch) {
        
        if (match[0] == match[0].toUpperCase()) {
          matches[match[0]] = value.toUpperCase();
        } else if (match[0] == capitalizedAll(match[0])) {
          matches[match[0]] = capitalizedAll(value);
        } else if (match[0] == capitalized(match[0])) {  
          matches[match[0]] = capitalized(value);
        } else {
          matches[match[0]] = value;
        }
      }
    }
    
    const re = new RegExp((matchWholeWord ? `\\b${replacementEntries.map((x) => x[0]).join("\\b|\\b")}\\b` : `${replacementEntries.map((x) => x[0]).join("|")}`), (caseInsensitive ? "gim" : "gm"));
    textNodes[i].textContent = text.replace(re, matched => matches[matched]);
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

let preferences;

let replacements;
let matchWholeWord;
let caseInsensitive;
let escapeRegexCharacters;
let converseSubstitutions;

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
  if (Object.keys(changes).indexOf("caseInsensitive") != -1) {
    caseInsensitive = changes["caseInsensitive"].newValue;
    resetTextNodesContents(textNodes);
    rewriteTextNodesContents(textNodes);
  }
  if (Object.keys(changes).indexOf("escapeRegexCharacters") != -1) {
    escapeRegexCharacters = changes["escapeRegexCharacters"].newValue;
    resetTextNodesContents(textNodes);
    rewriteTextNodesContents(textNodes);
  }
  if (Object.keys(changes).indexOf("converseSubstitutions") != -1) {
    converseSubstitutions = changes["converseSubstitutions"].newValue;
    resetTextNodesContents(textNodes);
    rewriteTextNodesContents(textNodes);
  }
  if (Object.keys(changes).indexOf("replacements") != -1) {
    replacements = changes["replacements"].newValue;
    resetTextNodesContents(textNodes);
    rewriteTextNodesContents(textNodes);
  }
});

chrome.storage.local.get('replacements').then((result) => {
  replacements = result.replacements;
  return chrome.storage.local.get('matchWholeWord');
}).then((result) => {
  matchWholeWord = result.matchWholeWord;
  return chrome.storage.local.get('caseInsensitive');
}).then((result) => {
  caseInsensitive = result.caseInsensitive;
  return chrome.storage.local.get('escapeRegexCharacters');
}).then((result) => {
  escapeRegexCharacters = result.escapeRegexCharacters;
  return chrome.storage.local.get('converseSubstitutions');
}).then((result) => {
  converseSubstitutions = result.converseSubstitutions;
  rewriteTextNodesContents(textNodes);
  return;
})