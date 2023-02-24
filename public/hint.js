const hints = [
  "Liking the card will help us know you like it. Disliking the card will help us know you don't like it. We can use this information to improve the deck.",
  "You can reset the deck by clicking the 'reset' button. This will allow you to view all cards again, including the ones you've already seen.",
  "You can skip a card by clicking the 'skip' button. This will add the card back to the deck for later.",
  "You can hit 'next' to view the next card in the deck. This will remove the card from the deck.",
  "You can add your own cards by clicking the add card button. This will allow you to add your own cards to the deck. Remember: The cards need to be approved by an admin before they are added to the deck.",
  "If you've added your own cards, you can view them by clicking the 'add new cards' button. This will allow you to view all the cards you've added to the deck.",
  "Like the app? You can help us by sharing it with your friends.",
  "Like a card? You can let us know by clicking the 'like' button. This will help us know which cards you like.",
  "Dislike a card? You can let us know by clicking the 'dislike' button. This will help us know which cards you don't like.",
  "Do you have a suggestion for the app? You can let us know by clicking the 'feedback' button. This will allow you to send us a message.",
  "Use the feedback button to let us know if you have any suggestions for the app.",
];

let lastHintIndex = null;

function addHint() {
  const hintIndex = Math.floor(Math.random() * hints.length);
  if (lastHintIndex === hintIndex) {
    addHint();
  } else {
    lastHintIndex = hintIndex;
    document.getElementById("hint").innerText = `Hint \n ${hints[hintIndex]}`;
  }
}
