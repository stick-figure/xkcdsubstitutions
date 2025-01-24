let k = 0;

function createReplacementEntryElement(entry) {
  let e = document.createElement("div");
  e.setAttribute("class", "listItem");
  e.innerHTML = `
  <div class="listItem">
    <label for="fname">Replace<input type="text" name="fname" value="John" class="key"></label>
    <label for="lname"> With <input type="text" name="lname" value="Doe" class="value"></label>
  </div>
  `;
  let keyInput = document.createElement("input");
  keyInput.setAttribute("class", "keyInput");
  keyInput.setAttribute("name", "keyInput"+k);
  let keyInput = document.createElement("input");
  keyInput.setAttribute("class", "valueInput");
  keyInput.setAttribute("class", "valueInput"+k);
  k++;
}

document.getElementById("matchWholeWord").addEventListener("change", (element) => {
  chrome.runtime.sendMessage({greeting: 'setMatchWholeWord', matchWholeWord: element.target.checked}, () => {
    return true;
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  chrome.runtime.sendMessage({greeting: 'getMatchWholeWord'}, (value) => {
    document.getElementById("matchWholeWord").checked = value;
    return true;
  });
  chrome.runtime.sendMessage({greeting: 'getReplacements'}, (value) => {
    console.log(value);
    return true;
  });
});
