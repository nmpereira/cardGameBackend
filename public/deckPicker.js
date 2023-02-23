// event listener when user selects a deck from the dropdown
document.getElementById("card-type").addEventListener("change", () => {
  console.log("deck selected", document.getElementById("card-type").value);
  addDeckChoiceToLocalStorage({
    deckName: document.getElementById("card-type").value,
    key: "deckChoice",
  });
});

document.getElementById("card-type").value = getDeckChoiceFromLocalStorage({
  key: "deckChoice",
});

function addDeckChoiceToLocalStorage({ deckName, key }) {
  console.log("deckName", deckName, key);
  if (!deckName || !key) {
    throw new Error("Deck name and key are required to save to local storage");
  }
  const storageKey = `${key}`;

  window.localStorage.setItem(storageKey, JSON.stringify(deckName));
}

function getDeckChoiceFromLocalStorage({ key }) {
  if (!key) {
    throw new Error("Key is required to get from local storage");
  }
  const storageKey = `${key}`;
  const deckName = JSON.parse(window.localStorage.getItem(storageKey));
  return deckName;
}
