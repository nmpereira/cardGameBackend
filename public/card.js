(async () =>
  getCard({
    skipped: false,
    type: document.getElementById("card-type").value,
  }))();

document.getElementById("nextCard").addEventListener(
  "click",
  async () =>
    await getCard({
      skipped: false,
      type: document.getElementById("card-type").value,
    })
);

document.getElementById("skipCard").addEventListener(
  "click",
  async () =>
    await getCard({
      skipped: true,
      type: document.getElementById("card-type").value,
    })
);

document.getElementById("likeCard").addEventListener("click", () =>
  rateCard({
    cardId: document.getElementById("cardId").innerText,
    rating: "likeCounter",
    user: JSON.parse(userData),
  })
);

document.getElementById("dislikeCard").addEventListener("click", () =>
  rateCard({
    cardId: document.getElementById("cardId").innerText,
    rating: "dislikeCounter",
    user: JSON.parse(userData),
  })
);

document.getElementById("resetCards").addEventListener("click", resetCards);

async function renderCard({ card, skipped }) {
  const { prompt, type, cardId, likeCounter, dislikeCounter } = card;
  document.getElementById("cardId").innerText = cardId;

  await animateCardPopup();

  document.getElementById("card-title").innerText = type
    ? type.toUpperCase()
    : "";

  if (!card) {
    return (document.getElementById("card-description").innerText =
      "No more cards");
  }

  if (!skipped) {
    console.log("updated without skipping", cardId);
  } else {
    console.log("skipped", cardId);
  }

  document.getElementById("card-description").innerText = prompt.toUpperCase();
  document.getElementById("dislikeCounter").innerText = dislikeCounter
    ? dislikeCounter
    : 0;
  document.getElementById("likeCounter").innerText = likeCounter
    ? likeCounter
    : 0;
}

async function getCard({ skipped, type = null }) {
  if (!type) {
    return (document.getElementById("card-description").innerText =
      "Pick a card deck".toUpperCase());
  }

  const res = await axios.get(
    `/random${!true ? "" : `?excludedCards=${`1,2,3`}`}`,
    {
      params: { type },
    }
  );

  renderCard({ card: res.data.message, skipped });
}

async function resetCards() {
  console.log("resetting cards");
}

async function rateCard({ cardId, rating, user }) {
  console.log("rating card", cardId, rating, user);
  console.log("window", window.location);
  const res = await axios
    .put(`/api/rate`, {
      cardId,
      rating,
      user,
    })
    .catch((err) => {
      console.log("err", err);
      if (err.response.data.requireLogin) {
        return (window.location.href = `${window.location.origin}/login`);
      }
      if (!err.response.data.ratingResponse.success) {
        console.log("error: ", err.response.data.ratingResponse.message);
        showAlert({
          message: err.response.data.ratingResponse.message,
          duration: 3,
        });
        return;
      }
    });

  console.log(res);
  document.getElementById("likeCounter").innerText =
    res.data.response.likeCounter;
  document.getElementById("dislikeCounter").innerText =
    res.data.response.dislikeCounter;
}

// animate card popup
async function animateCardPopup() {
  const cardBody = document.getElementById("card-body");
  const animationSpeed = 10;

  cardBody.style.opacity = 0;

  let scale = 0.1;
  let currentScale = scale;
  for (let i = 0; i < 13; i++) {
    if (i <= 10) {
      currentScale = currentScale + scale;
    } else {
      currentScale = currentScale - scale;
    }
    await new Promise((resolve) => setTimeout(resolve, animationSpeed));

    cardBody.style.opacity = currentScale;
    cardBody.style.transform = `scale(${currentScale})`;
  }
}
