(async () => {
  await addCardsToTable();
})();

async function getCardsByUser({ email }) {
  // send a axios GET request to the server
  return await axios.get(`/api/usercards/${email}`).then(async (res) => {
    return await res.data;
  });
}

async function addCardsToTable() {
  const cards = await getCardsByUser({ email: JSON.parse(userData).email });

  console.log("cards", cards);

  cards.message.sort((a, b) => {
    // sort if verified and then by date ascending
    if (a.verified && !b.verified) {
      return -1;
    } else if (!a.verified && b.verified) {
      return 1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  for (let i = 0; i < cards.message.length; i++) {
    console.log("cards at", i, cards.message[i]);

    const table = document.getElementById("prompts-table");
    //  use add child instead of insert row
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");
    const cell5 = document.createElement("td");

    cell1.innerText = cards.message[i].cardId;
    cell2.innerText = new Date(cards.message[i].createdAt).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
    cell3.innerText = cards.message[i].type;
    cell4.innerText = cards.message[i].verified ? "Yes" : "No";
    cell5.innerText = cards.message[i].prompt;

    //  append the cells to the row
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);

    //  append the row to the table

    table.appendChild(row);
    console.log("done", table, row);
  }
}
