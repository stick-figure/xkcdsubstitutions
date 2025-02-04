let k = 0;

let blacklist;
let wrapperProperties;

function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
}

function appendBlacklistEntryElement(url) {
  
  const entryElement = document.createElement("div");
  entryElement.setAttribute("id", "listItem");
  entryElement.setAttribute("class", "listItem");
  
  const urlInput = document.createElement("input");
  urlInput.setAttribute("type", "url");
  urlInput.setAttribute("name", "urlInput"+k);
  urlInput.setAttribute("id", "urlInput"+k);
  urlInput.setAttribute("value", url);
  urlInput.setAttribute("class", "urlInput");
  entryElement.appendChild(urlInput);

  const deleteEntry = document.createElement("input");
  deleteEntry.setAttribute("type", "button");
  deleteEntry.setAttribute("class", "deleteEntry");
  deleteEntry.setAttribute("name", "deleteEntry"+k);
  deleteEntry.setAttribute("id", "deleteEntry"+k);

  entryElement.appendChild(deleteEntry);
  
  urlInput.addEventListener("change", (event) => {
    let index = Array.from(entryElement.parentNode.childNodes).indexOf(entryElement);
    
    if (urlInput.value.length == 0) {
      blacklist.splice(index, 1);
      
      chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: blacklist}, () => {
        entryElement.remove();
        return true;
      });
      
      return true;
    }
    
    blacklist[index] = urlInput.value;

    chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: blacklist}, () => {
      return true;
    });
  });
  
  deleteEntry.addEventListener("click", (event) => {
    let index = Array.from(entryElement.parentNode.childNodes).indexOf(entryElement);
    
    blacklist.splice(index, 1);
      
    chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: blacklist}, () => {
      entryElement.remove();
      return true;
    });
      
    return true;
  });

  k++;
  return entryElement;
}

function updateBlacklistEntries(listContainer) {
  listContainer.innerHTML = "";
  for (let i=0; i<blacklist.length; i++) {
    let entryElement = appendBlacklistEntryElement(blacklist[i]);
    listContainer.appendChild(entryElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const entryListContainer = document.getElementById("blacklist");
  const matchWholeWordCheckbox = document.getElementById("matchWholeWord");
  const caseInsensitiveCheckbox = document.getElementById("caseInsensitive");
  const autoCapitalizeCheckbox = document.getElementById("autoCapitalize");
  const escapeRegexCharactersCheckbox = document.getElementById("escapeRegexCharacters");
  const wrapSubstitutionsCheckbox = document.getElementById("wrapSubstitutions");
  const revealTypeSelect = document.getElementById("revealType");
  const wrapPropsCheckboxes = Array.from(document.getElementsByClassName("wrapProps"));

  chrome.runtime.sendMessage({greeting: 'getMatchWholeWord'}, (response) => {
    matchWholeWordCheckbox.checked = response.matchWholeWord;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getCaseInsensitive'}, (response) => {
    caseInsensitiveCheckbox.checked = response.caseInsensitive;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getAutoCapitalize'}, (response) => {
    autoCapitalizeCheckbox.checked = response.autoCapitalize;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getEscapeRegexCharacters'}, (response) => {
    escapeRegexCharactersCheckbox.checked = response.escapeRegexCharacters;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getWrapSubstitutions'}, (response) => {
    wrapSubstitutionsCheckbox.checked = response.wrapSubstitutions;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getRevealType'}, (response) => {
    revealTypeSelect.value = response.revealType;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getWrapperProperties'}, (response) => {
    wrapperProperties = response.wrapperProperties;
    for (checkbox of wrapPropsCheckboxes) {
      checkbox.checked = wrapperProperties.indexOf(checkbox.getAttribute("name")) != -1;
    }
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getBlacklist'}, (response) => {
    blacklist = response.blacklist;
    updateBlacklistEntries(entryListContainer);
    return true;
  });
  
  document.getElementById("back").addEventListener("click", (event) => {
    window.history.back();
  });

  document.getElementById("resetPrefs").addEventListener("click", (event) => {
    chrome.runtime.sendMessage({greeting: 'resetPreferences'}, () => {
      chrome.runtime.sendMessage({greeting: 'getMatchWholeWord'}, (response) => {
        matchWholeWordCheckbox.checked = response.matchWholeWord;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getCaseInsensitive'}, (response) => {
        caseInsensitiveCheckbox.checked = response.caseInsensitive;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getAutoCapitalize'}, (response) => {
        autoCapitalizeCheckbox.checked = response.autoCapitalize;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getEscapeRegexCharacters'}, (response) => {
        escapeRegexCharactersCheckbox.checked = response.escapeRegexCharacters;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getWrapSubstitutions'}, (response) => {
        wrapSubstitutionsCheckbox.checked = response.wrapSubstitutions;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getRevealType'}, (response) => {
        revealTypeSelect.value = response.revealType;
        return true;
      });
      chrome.runtime.sendMessage({greeting: 'getWrapperProperties'}, (response) => {
        wrapperProperties = response.wrapperProperties;
        for (checkbox of wrapPropsCheckboxes) {
          checkbox.checked = wrapperProperties.indexOf(checkbox.getAttribute("name")) != -1;
        }
        return true;
      });
      
      chrome.runtime.sendMessage({greeting: 'getBlacklist'}, (response) => {
        blacklist = response.blacklist;
        updateBlacklistEntries(entryListContainer);
        return true;
      });
      return true;
    });
  });
  
  matchWholeWordCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setMatchWholeWord', matchWholeWord: element.target.checked}, () => {
      return true;
    });
  });
  caseInsensitiveCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setCaseInsensitive', caseInsensitive: element.target.checked}, () => {
      return true;
    });
  });
  autoCapitalizeCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setAutoCapitalize', autoCapitalize: element.target.checked}, () => {
      return true;
    });
  });
  escapeRegexCharactersCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setEscapeRegexCharacters', escapeRegexCharacters: element.target.checked}, () => {
      return true;
    });
  });
  wrapSubstitutionsCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setWrapSubstitutions', wrapSubstitutions: element.target.checked}, () => {
      return true;
    });
  });
  revealTypeSelect.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setRevealType', revealType: parseInt(revealTypeSelect.value)}, () => {
      return true;
    });
  });

  for (let i=0; i<wrapPropsCheckboxes.length; i++) {
    let checkbox = wrapPropsCheckboxes[i];

    checkbox.addEventListener("change", (element) => {
      if (checkbox.checked && wrapperProperties.indexOf(checkbox.getAttribute("name")) == -1) {
        wrapperProperties += " " + checkbox.getAttribute("name");
      } else if (!checkbox.checked) {
        wrapperProperties = wrapperProperties.replace(checkbox.getAttribute("name"), "");
      }
      wrapperProperties = wrapperProperties.trim();

      chrome.runtime.sendMessage({greeting: 'setWrapperProperties', wrapperProperties: wrapperProperties}, () => {
        return true;
      });
    });
  }
  
  document.getElementById("downloadPrefs").addEventListener("click", (event) => {
    
    chrome.runtime.sendMessage({greeting: 'getReplacements'}, (response) => {
      downloadJSON("xkcdsubstitution_preferences.json", {
        matchWholeWord: matchWholeWordCheckbox.checked, 
        caseInsensitive: caseInsensitiveCheckbox.checked,
        autoCapitalize: autoCapitalizeCheckbox.checked,
        escapeRegexCharacters: escapeRegexCharactersCheckbox.checked,
        wrapSubstitutions: wrapSubstitutionsCheckbox.checked,
        revealType: revealTypeSelect.value,
        wrapperProperties: wrapperProperties,
        replacements: response.replacements,
        blacklist: blacklist,
      });
      return true;
    });
  });

  document.getElementById("uploadPrefs").addEventListener("change", (event) => {
    var reader = new FileReader();
    function onLoadReader(readerEvent) {
      console.log(readerEvent.target.result);
      var jsonObj = JSON.parse(readerEvent.target.result);
      
      chrome.runtime.sendMessage({greeting: 'setMatchWholeWord', matchWholeWord: jsonObj.matchWholeWord}, () => {
        return true;
      });
      matchWholeWordCheckbox.checked = jsonObj.matchWholeWord;
      
      chrome.runtime.sendMessage({greeting: 'setCaseInsensitive', caseInsensitive: jsonObj.caseInsensitive}, () => {
        return true;
      });
      caseInsensitiveCheckbox.checked = jsonObj.caseInsensitive;
      
      chrome.runtime.sendMessage({greeting: 'setAutoCapitalize', autoCapitalize: jsonObj.autoCapitalize}, () => {
        return true;
      });
      autoCapitalizeCheckbox.checked = jsonObj.autoCapitalize;

      chrome.runtime.sendMessage({greeting: 'setEscapeRegexCharacters', escapeRegexCharacters: jsonObj.escapeRegexCharacters}, () => {
        return true;
      });
      escapeRegexCharactersCheckbox.checked = jsonObj.escapeRegexCharacters;

      chrome.runtime.sendMessage({greeting: 'setWrapSubstitutions', wrapSubstitutions: jsonObj.wrapSubstitutions}, () => {
        return true;
      });
      wrapSubstitutionsCheckbox.checked = jsonObj.wrapSubstitutions;

      chrome.runtime.sendMessage({greeting: 'revealType', revealType: jsonObj.revealType}, () => {
        return true;
      });
      revealTypeSelect.checked = jsonObj.revealType;

      chrome.runtime.sendMessage({greeting: 'wrapperProperties', wrapperProperties: jsonObj.wrapperProperties}, () => {
        return true;
      });
      
      blacklist = jsonObj.blacklist;
      chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: jsonObj.blacklist}, () => {
        return true;
      });
      
      updateBlacklistEntries(entryListContainer);
    }
    reader.onload = onLoadReader;
    
    reader.readAsText(event.target.files[0]);
  });

  document.getElementById("newEntry").addEventListener("click", (event) => {
    chrome.windows.getCurrent(w => {
      chrome.tabs.query({active: true, windowId: w.id}, tabs => {
        let entryElement = appendBlacklistEntryElement("");
        entryListContainer.appendChild(entryElement);
        entryListContainer.scrollTo(0, entryListContainer.scrollHeight);
        blacklist.push("");
        chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: blacklist}, () => {
          return true;
        });
      });
    });
  });
  document.getElementById("clearEntries").addEventListener("click", (event) => {
    entryListContainer.innerHTML = "";
    blacklist = [];
    chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: blacklist}, () => {
      return true;
    });
  });
});