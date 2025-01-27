let k = 0;

let replacements;

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

function createReplacementEntryElement(key, value) {
  const entryElement = document.createElement("div");
  entryElement.setAttribute("id", "listItem");
  entryElement.setAttribute("class", "listItem");
  
  /*
  entryElement.innerHTML = `
    <label for="keyInput${k}"> Replace <input type="text" name="keyInput${k}" id="keyInput${k}" value="${key}" class="keyInput"></label>
    <label for="valueInput${k}"> With <input type="text" name="valueInput${k}" id="valueInput${k}" value="${value}" class="valueInput"></label>
  `;*/
  
  const keyInput = document.createElement("input");
  keyInput.setAttribute("type", "text");
  keyInput.setAttribute("name", "keyInput"+k);
  keyInput.setAttribute("id", "keyInput"+k);
  keyInput.setAttribute("value", key);
  keyInput.setAttribute("class", "keyInput");
  
  const keyLabel = document.createElement("label");
  keyLabel.setAttribute("for", "keyInput"+k)
  keyLabel.textContent = "Replace ";

  entryElement.appendChild(keyLabel);
  entryElement.appendChild(keyInput);

  const valueInput = document.createElement("input");
  valueInput.setAttribute("type", "text");
  valueInput.setAttribute("name", "valueInput"+k);
  valueInput.setAttribute("id", "valueInput"+k);
  valueInput.setAttribute("value", value);
  valueInput.setAttribute("class", "valueInput");
  
  const valueLabel = document.createElement("label");
  valueLabel.setAttribute("for", "valueInput"+k);
  valueLabel.textContent = " With ";

  entryElement.appendChild(valueLabel);
  entryElement.appendChild(valueInput);

  const deleteEntry = document.createElement("input");
  deleteEntry.setAttribute("type", "button");
  deleteEntry.setAttribute("class", "deleteEntry");
  deleteEntry.setAttribute("name", "deleteEntry"+k);
  deleteEntry.setAttribute("id", "deleteEntry"+k);

  entryElement.appendChild(deleteEntry);

  keyInput.oldvalue = "";
  keyInput.addEventListener("focus", (event) => {
    keyInput.oldvalue = keyInput.value;
    console.log(keyInput.oldvalue );
  });
  keyInput.addEventListener("focusout", (event) => {
//    if (replacements.hasOwnProperty(keyInput.value)) return;
    
//    delete Object.assign(replacements, {[keyInput.value]: replacements[keyInput.oldvalue] })[keyInput.oldvalue];
    delete replacements[keyInput.oldvalue];
    
    if (keyInput.value.length == 0) {
      delete replacements[keyInput.value];
      
      chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
        entryElement.remove();
        return true;
      });
      
      return true;
    }

    replacements[keyInput.value] = valueInput.value;

    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });

  valueInput.oldvalue = "";
  valueInput.addEventListener("focus", (event) => {
    valueInput.oldvalue = valueInput.value;
  });
  valueInput.addEventListener("change", (event) => {
//    if (replacements.hasOwnProperty(valueInput.value)) return;
    
    if (keyInput.value.length == 0) return;
    replacements[keyInput.value] = valueInput.value;

    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });

  deleteEntry.addEventListener("click", (event) => {
    delete replacements[keyInput.value];
    
    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      entryElement.remove();
      return true;
    });
  });

  k++;
  return entryElement;
}

function updateReplacementEntries(listContainer) {
  listContainer.innerHTML = "";
  for (const [key, value] of Object.entries(replacements)) {
    let entryElement = createReplacementEntryElement(key, value);
    listContainer.appendChild(entryElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const entryListContainer = document.getElementById("entryList");
  const matchWholeWordCheckbox = document.getElementById("matchWholeWord");
  const caseInsensitiveCheckbox = document.getElementById("caseInsensitive");
  const escapeRegexCharactersCheckbox = document.getElementById("escapeRegexCharacters");
  const converseSubstitutionsCheckbox = document.getElementById("converseSubstitutions");
  
  chrome.runtime.sendMessage({greeting: 'getMatchWholeWord'}, (response) => {
    matchWholeWordCheckbox.checked = response.matchWholeWord;
    return true;
  });
  
  chrome.runtime.sendMessage({greeting: 'getCaseInsensitive'}, (response) => {
    caseInsensitiveCheckbox.checked = response.caseInsensitive;
    return true;
  });

  chrome.runtime.sendMessage({greeting: 'getEscapeRegexCharacters'}, (response) => {
    escapeRegexCharactersCheckbox.checked = response.escapeRegexCharacters;
    return true;
  });
  
  chrome.runtime.sendMessage({greeting: 'getConverseSubstitutions'}, (response) => {
    converseSubstitutionsCheckbox.checked = response.converseSubstitutions;
    return true;
  });
  
  chrome.runtime.sendMessage({greeting: 'getReplacements'}, (response) => {
    replacements = response.replacements;
    updateReplacementEntries(entryListContainer);
    return true;
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
  escapeRegexCharactersCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setEscapeRegexCharacters', escapeRegexCharacters: element.target.checked}, () => {
      return true;
    });
  });
  converseSubstitutionsCheckbox.addEventListener("change", (element) => {
    chrome.runtime.sendMessage({greeting: 'setConverseSubstitutions', converseSubstitutions: element.target.checked}, () => {
      return true;
    });
  });
  
  document.getElementById("downloadPrefs").addEventListener("click", (event) => {
    downloadJSON("xkcdsubstitution_preferences.json", {matchWholeWord: matchWholeWordCheckbox.checked, replacements: replacements});
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
      
      chrome.runtime.sendMessage({greeting: 'setEscapeRegexCharacters', escapeRegexCharacters: jsonObj.escapeRegexCharacters}, () => {
        return true;
      });
      escapeRegexCharactersCheckbox.checked = jsonObj.escapeRegexCharacters;
      
      chrome.runtime.sendMessage({greeting: 'setConverseSubstitutions', converseSubstitutions: jsonObj.converseSubstitutions}, () => {
        return true;
      });
      converseSubstitutionsCheckbox.checked = jsonObj.converseSubstitutions;
      
      replacements = jsonObj.replacements;
      chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: jsonObj.replacements}, () => {
        return true;
      });
      updateReplacementEntries(entryListContainer);
    }
    reader.onload = onLoadReader;
    
    reader.readAsText(event.target.files[0]);
  });

  document.getElementById("newEntry").addEventListener("click", (event) => {
    let entryElement = createReplacementEntryElement("", "");
    entryListContainer.appendChild(entryElement);
    entryListContainer.scrollTo(0, entryListContainer.scrollHeight);
  });
  document.getElementById("clearEntries").addEventListener("click", (event) => {
    
    entryListContainer.innerHTML = "";
    replacements = {};
    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });
});

window.addEventListener("beforeunload", () => {
  if (replacements[""] !== undefined) delete replacements[""];
  
  chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
    return true;
  });
});
