let k = 0;

let replacements;
let currentEntry = null;
let entryListContainer;

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
  entryElement.draggable = true;
  
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
  
  keyInput.addEventListener("focusout", (event) => {
    let eIndex = Array.prototype.indexOf.call(entryElement.parentNode.childNodes, entryElement);
    if (keyInput.value.length == 0) {
      replacements.splice(eIndex, 1);
      
      chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
        entryElement.remove();
        return true;
      });
      
      return true;
    }
    
    replacements[eIndex][0] = keyInput.value;

    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });
  
  valueInput.addEventListener("focusout", (event) => {
    if (keyInput.value.length == 0) return;
    let eIndex = Array.prototype.indexOf.call(entryElement.parentNode.childNodes, entryElement);
    replacements[eIndex][1] = valueInput.value;
    
    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });

  deleteEntry.addEventListener("click", (event) => {
    let eIndex = Array.prototype.indexOf.call(entryElement.parentNode.childNodes, entryElement);
    replacements.splice(eIndex, 1);
    
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
  for (let i=0; i<replacements.length; i++) {
    let entryElement = createReplacementEntryElement(replacements[i][0], replacements[i][1]);
    listContainer.appendChild(entryElement);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  entryListContainer = document.getElementById("entryList");
  entryListContainer.addEventListener("dragstart", (e) => {
    Array.from(document.querySelectorAll(".listItem input")).forEach(item => {item.disabled = true;});
    currentEntry = e.target;

    currentEntry.classList.add("dragging");
  });  
  // 
  entryListContainer.addEventListener("dragend", () => { 
    Array.from(document.querySelectorAll(".listItem input")).forEach(item => {item.disabled = false;});
    currentEntry.classList.remove("dragging");

    currentEntry = null;
  });
  entryListContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    Array.from(document.querySelectorAll(".listItem input")).forEach(item => {
      item.disabled = true;
    });
    const afterElement = Array.from(entryListContainer.childNodes).reduce((closest, child) => {
      child.classList.remove("hint");
      const box = child.getBoundingClientRect();
      const offset = e.clientY - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child};
      } else {
        return closest;
      }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
    if (afterElement) afterElement.classList.add("hint");
    const containerBox = entryListContainer.getBoundingClientRect();
    const offset = e.clientY - containerBox.top - containerBox.height / 2;
    if (Math.abs(offset) > containerBox.height / 3) entryListContainer.scrollBy({ top: offset, behavior: 'smooth'});
  });
  
  entryListContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const afterElement = Array.from(entryListContainer.childNodes).reduce((closest, child) => {
      child.classList.remove("hint");
      const box = child.getBoundingClientRect();
      const offset = e.clientY - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child};
      } else {
        return closest;
      }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
    currentEntry.classList.remove("hint");
//tiojfidiofdoijoijdf
    replacements.splice(Array.prototype.indexOf.call(entryListContainer.childNodes, currentEntry), 1);
    if (afterElement == null) {
      entryListContainer.appendChild(currentEntry);
    } else {
      afterElement.classList.remove("hint");
      entryListContainer.insertBefore(currentEntry, afterElement);
    }
    replacements.splice(Array.prototype.indexOf.call(entryListContainer.childNodes, currentEntry), 0, [
      currentEntry.getElementsByClassName("keyInput")[0].value,
      currentEntry.getElementsByClassName("valueInput")[0].value,
    ]);
//tiojfidiofdoijoijdf
    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });

  chrome.windows.getCurrent(w => {
    chrome.tabs.query({active: true, windowId: w.id}, tabs => {
      chrome.runtime.sendMessage({greeting: 'getBlacklist'}, (response) => {
        let tabRegex = tabs[0].url.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
        document.getElementById("blockThisSite").checked = response.blacklist.length > 0 && new RegExp(response.blacklist.join("|"), "gi").test(tabs[0].url);
        if (!document.getElementById("blockThisSite").checked) return;
        while (response.blacklist.indexOf(tabRegex) != -1) {
          response.blacklist.splice(response.blacklist.indexOf(tabRegex), 1);
        }
        console.log(Array.from(tabs[0].url.matchAll(new RegExp(response.blacklist.join("|"), "gi"))));
        document.getElementById("blockThisSite").disabled = response.blacklist.length > 0 && new RegExp(response.blacklist.join("|"), "gi").test(tabs[0].url);
      });
    });
  });
  
  chrome.runtime.sendMessage({greeting: 'getReplacements'}, (response) => {
    replacements = response.replacements;
    updateReplacementEntries(entryListContainer);
    return true;
  });

  document.getElementById("options").addEventListener("click", (event) => {
    window.location.href = "options.html";
  });

  document.getElementById("blockThisSite").addEventListener("change", (event) => {
    chrome.windows.getCurrent(w => {
      chrome.tabs.query({active: true, windowId: w.id}, tabs => {
        let tabUrl = tabs[0].url.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
        chrome.runtime.sendMessage({greeting: 'getBlacklist'}, (response) => {
          let myBlacklist = response.blacklist;
          if (event.target.checked && myBlacklist.indexOf(tabUrl) == -1) {
            myBlacklist.push(tabUrl);
          } else if (!event.target.checked) {
            while (myBlacklist.indexOf(tabUrl) != -1) {
              myBlacklist.splice(myBlacklist.indexOf(tabUrl), 1);
            }
          }
          chrome.runtime.sendMessage({greeting: 'setBlacklist', blacklist: myBlacklist}, (response) => {});
          return true;
        });
      });
    });
  });
  
  document.getElementById("newEntry").addEventListener("click", (event) => {
    replacements.push(["", ""]);
    let entryElement = createReplacementEntryElement(replacements[replacements.length-1][0], replacements[replacements.length-1][1]);
    entryListContainer.appendChild(entryElement);
    entryListContainer.scrollTo(0, entryListContainer.scrollHeight);
  });
  document.getElementById("clearEntries").addEventListener("click", (event) => {
    entryListContainer.innerHTML = "";
    replacements.splice(0, replacements.length);
    chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
      return true;
    });
  });
});

window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({greeting: 'setReplacements', replacements: replacements}, () => {
    return true;
  });
});