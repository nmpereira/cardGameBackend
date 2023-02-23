function addCardToLocalStorage({ key, value, game }) {
  if (!key || !value || !game) {
    throw new Error(
      "Key, value and game are required to save to local storage"
    );
  }
  const storageKey = `${key}-${game.split(" ").join("-")}`;
  let cardList = JSON.parse(window.localStorage.getItem(storageKey));

  console.log("cardList-before", cardList, key, value, game, storageKey);
  if (!cardList) {
    // add to local storage with key and value
    cardList = [];
    window.localStorage.setItem(storageKey, JSON.stringify(cardList));
  } else {
    cardList.push(value);
    window.localStorage.setItem(storageKey, JSON.stringify(cardList));
  }
  console.log("cardList-after", cardList);
}

function getCardsFromLocalStorage({ key, game }) {
  if (!key || !game) {
    throw new Error("Key and game is required to get from local storage");
  }
  const storageKey = `${key}-${game.split(" ").join("-")}`;
  const cardList = JSON.parse(window.localStorage.getItem(storageKey));
  console.log("cardList", cardList);
  return cardList;
}

function resetCards({ key, game }) {
  if (!key || !game) {
    throw new Error("Key and game is required to reset local storage");
  }
  const storageKey = `${key}-${game.split(" ").join("-")}`;
  window.localStorage.removeItem(storageKey);

  //   reload the page
  window.location.reload();

  showAlert({
    message: "Cards have been reset. You can now start rating cards again.",
    duration: 3,
  });
}
