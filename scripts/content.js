let textNodes = [];
let originalTextNodes = [];

function getAllTextNodes(node) {
  var nodes = [];
  
  if (node) {
    node = node.firstChild;
    while(node != null) {
      if (["SCRIPT", "STYLE"].indexOf(node.tagName) >= 0) {
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
  if (blacklist.length > 0 && new RegExp(blacklist.join("|"), "i").test(window.location.href)) {
    return;
  }
  
  resetTextNodesContents(textNodes);
  
  if (replacements.length == 0) {
    return;
  }
  
  if (!textNodes) {
    return;
  }

  let replacementEntries = replacements.map(a => {return {...a}});
  
  if (escapeRegexCharacters) {
    for (let i = 0; i < replacementEntries.length; i++) {
      replacementEntries[i][0] = replacementEntries[i][0].replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
      replacementEntries[i][1] = replacementEntries[i][1].replace(/\$/g, '$$$$');
    }
  }
  
  const re = new RegExp(replacementEntries.slice(1).reduce(
    (accumulator, currentRe) => {
      let numberGroups = /([^\\]|^)(?=\((?!\?:))/g; // Home-made regexp to count groups.
      let offset = accumulator.match(numberGroups).length;
      let escapedMatch = /[\\](?:(\d+)|.)/g;        // Home-made regexp for escaped literals, greedy on numbers.
      
      let reNewSource = currentRe[0].replace(escapedMatch, (match, number) => {return number ? "\\"+(parseInt(number)+offset) : match; });
      return accumulator + (matchWholeWord ? "\\b|\\b" : "|") + reNewSource;
    }, replacementEntries[0][0]), "gm" + (caseInsensitive && "i"));
  
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent.toString();
    const matches = {};
    for (let j = 0; j < replacementEntries.length; j++) {
      let key = replacementEntries[j][0];
      if (key.length == 0) continue;
      let value = replacementEntries[j][1];
      let regex = new RegExp((matchWholeWord ? `\\b${key}\\b` : key), (caseInsensitive ? "gim" : "gm"));
      
      const entryMatch = [...text.matchAll(regex)];
      for (let match of entryMatch) {
        matches[match[0]] = match;
        matches[match[0]].regex = regex;
        matches[match[0]].value = value;

        if (!autoCapitalize || !/\w/.test(match[0])) {
          continue;
        } else if (match[0] == match[0].toUpperCase()) {
          matches[match[0]].value = value.toUpperCase();
        } else if (match[0] == capitalizedAll(match[0])) {
          matches[match[0]].value = capitalizedAll(value);
        } else if (match[0] == capitalized(match[0])) {  
          matches[match[0]].value = capitalized(value);
        }
      }
    }
    
    if (wrapSubstitutions && textNodes[i].nodeType == Node.TEXT_NODE && textNodes[i].parentNode && 
      ["TEXTAREA",].indexOf(textNodes[i].parentNode.tagName) == -1) {
      let child = textNodes[i];
      child.textContent.toString().replaceAll(re, (matched) => {
        let offset = child.textContent.indexOf(matched);
        if (offset == -1) return;
        let newTextNode = child.splitText(offset);
        newTextNode.textContent = newTextNode.textContent.slice(matched.length);
        let tag = document.createElement(wrapperProperties.indexOf("code") > -1 ? "code" : "span");
        tag.setAttribute("class", "xkcdsubstitutions tag " + wrapperProperties);
        
        let textHolder;
        if (wrapperProperties.indexOf("marquee") > -1) {
          textHolder = document.createElement("span");
          if (!textHolder.textContent) textHolder.textContent = matched;
          textHolder.setAttribute("class", "xkcdsubstitutions marquee-content");
          tag.appendChild(textHolder);
        } else {
          textHolder = tag;
        }
        if (!textHolder.textContent) textHolder.textContent = matched;
        textHolder.textContent = textHolder.textContent.replaceAll(matches[matched].regex, matches[matched].value);
        
        if (revealType == 1) { 
          textHolder.setAttribute("title", matched);
        }
        if (revealType == 2) {
          textHolder.hoverValue = matched;
          textHolder.addEventListener("mouseover", (event) => {
            let hoverValue = textHolder.hoverValue.toString();
            textHolder.hoverValue = textHolder.textContent;
            textHolder.textContent = hoverValue;
          });
          textHolder.addEventListener("mouseout", (event) => {
            let hoverValue = textHolder.hoverValue.toString();
            textHolder.hoverValue = textHolder.textContent;
            textHolder.textContent = hoverValue;
          });
        }
        if (revealType == 3) textHolder.textContent = matched;
        
        child.parentNode.insertBefore(tag, newTextNode);
        
        child = newTextNode;
      });
    } else {
      text.replaceAll(re, (matched) => {
        if (!matches[matched]) return;
        textNodes[i].textContent = textNodes[i].textContent.replaceAll(matches[matched].regex, matches[matched].value);
      });
    }
  }
  
  let marqueeContents = document.getElementsByClassName("xkcdsubstitutions marquee-content");
  for (let i=0; i<marqueeContents.length; i++) {
    let speed = 10;
    distancePx = marqueeContents[i].parentNode.offsetWidth;
    duration = distancePx / speed;
    marqueeContents[i].style["-moz-animation"] = `scroll-left ${duration}s linear infinite`;
    marqueeContents[i].style["-webkit-animation"] = `scroll-left ${duration}s linear infinite`;
    marqueeContents[i].style["animation"] = `scroll-left ${duration}s linear infinite`;
  }
}

function resetTextNodesContents(textNodes) {
  if (wrapSubstitutions) {
    let tags = document.getElementsByClassName("xkcdsubstitutions tag");
    while (tags.length > 0) {
      if (tags[0].getAttribute("class").indexOf("marquee") > -1) {
        tags[0].textContent = tags[0].firstChild.textContent;
        tags[0].removeChild(tags[0].firstChild);
      }
      let tagIndex = Array.from(tags[0].parentNode.childNodes).indexOf(tags[0]);
      let olderSibling = tags[0].parentNode.childNodes[tagIndex-1];
      let youngerSibling = tags[0].parentNode.childNodes[tagIndex+1];
      
      if (olderSibling) {
        olderSibling.textContent += tags[0].textContent;
        if (youngerSibling) {
          olderSibling.textContent += youngerSibling.textContent;
          youngerSibling.remove();
        }
      } else if (youngerSibling) {
        youngerSibling.textContent = tags[0].textContent + youngerSibling.textContent;
      }
      tags[0].remove();
    }
  }
  
  for (let i = 0; i < originalTextNodes.length; i++) {
    textNodes[i].textContent = originalTextNodes[i].textContent;
  }
}

function setTextNodes() {
  textNodes = getAllTextNodes(document.body);
  textNodes.concat(Array.from(document.querySelector("title").childNodes).filter(function() {
    return this.nodeType == Node.TEXT_NODE;
  }));
  
  originalTextNodes = [];
  for (let i = 0; i < textNodes.length; i++) {
    originalTextNodes.push(textNodes[i].cloneNode(true));
  }
}

let preferences;

let replacements;
let blacklist;
let matchWholeWord;
let caseInsensitive;
let autoCapitalize;
let escapeRegexCharacters;
let wrapSubstitutions;
let revealType;
let wrapperProperties;

function onDocumentReady() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
    if (Object.keys(changes).indexOf("matchWholeWord") != -1) {
      matchWholeWord = changes["matchWholeWord"].newValue;
    }
    if (Object.keys(changes).indexOf("caseInsensitive") != -1) {
      caseInsensitive = changes["caseInsensitive"].newValue;
    }
    if (Object.keys(changes).indexOf("autoCapitalize") != -1) {
      caseInsensitive = changes["autoCapitalize"].newValue;
    }
    if (Object.keys(changes).indexOf("escapeRegexCharacters") != -1) {
      escapeRegexCharacters = changes["escapeRegexCharacters"].newValue;
    }
    if (Object.keys(changes).indexOf("wrapSubstitutions") != -1) {
      resetTextNodesContents(textNodes);
      wrapSubstitutions = changes["wrapSubstitutions"].newValue;
    }
    if (Object.keys(changes).indexOf("revealType") != -1) {
      revealType = changes["revealType"].newValue;
    }
    if (Object.keys(changes).indexOf("wrapperProperties") != -1) {
      wrapperProperties = changes["wrapperProperties"].newValue;
    }
    if (Object.keys(changes).indexOf("replacements") != -1) {
      replacements = changes["replacements"].newValue;
    }
    if (Object.keys(changes).indexOf("blacklist") != -1) {
      blacklist = changes["blacklist"].newValue;
      if (blacklist.length > 0 && new RegExp(blacklist.join("|"), "i").test(window.location.href)) {
        resetTextNodesContents(textNodes);
      }
    }
    rewriteTextNodesContents(textNodes);
  });
  
  chrome.storage.local.get('replacements').then((result) => {
    replacements = result.replacements;
    return chrome.storage.local.get('blacklist');
  }).then((result) => {
    blacklist = result.blacklist;
    return chrome.storage.local.get('matchWholeWord');
  }).then((result) => {
    matchWholeWord = result.matchWholeWord;
    return chrome.storage.local.get('caseInsensitive');
  }).then((result) => {
    caseInsensitive = result.caseInsensitive;
    return chrome.storage.local.get('autoCapitalize');
  }).then((result) => {
    autoCapitalize = result.autoCapitalize;
    return chrome.storage.local.get('escapeRegexCharacters');
  }).then((result) => {
    escapeRegexCharacters = result.escapeRegexCharacters;
    return chrome.storage.local.get('wrapSubstitutions');
  }).then((result) => {
    wrapSubstitutions = result.wrapSubstitutions;
    return chrome.storage.local.get('revealType');
  }).then((result) => {
    revealType = result.revealType;
    return chrome.storage.local.get('wrapperProperties');
  }).then((result) => {
    wrapperProperties = result.wrapperProperties;
    
    setTextNodes();
    rewriteTextNodesContents(textNodes);
    return;
  });
}

if (document.readyState === "complete")
{
  onDocumentReady();
} else {
  window.addEventListener("load", () => {
    onDocumentReady();
  });
}