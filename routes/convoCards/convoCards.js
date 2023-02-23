// create routes for convoCards

const express = require("express");
const router = express.Router();
const ConvoCard = require("../../models/convoCards/convoCards");
const Usercard = require("../../models/userCards/userCards");

// get last cardId
const getLastCardId = async () => {
  try {
    // get last cardId but if there are no cards, return 0
    const lastCard = await ConvoCard.findOne({}).sort({ cardId: -1 }).exec();
    return lastCard ? lastCard.cardId : 0;
  } catch (error) {
    console.log("error", error);
  }
};

async function getCardsByUser({ email }) {
  const cards = await ConvoCard.find({
    username: email,
  }).lean();
  return { cards };
}

router.get("/usercards/:email", async (req, res) => {
  try {
    // get all usercards for a user
    const { email } = req.params;
    const { cards } = await getCardsByUser({ email });

    res.status(200).json({ message: cards, count: cards.length });
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/", (req, res) => {
  try {
    // create new card with a incremented cardId
    const { prompt, username, type } = req.body;
    console.log("req.body", req.body);

    if (!prompt || !username || !type) {
      res
        .status(400)
        .json({ message: "Prompt, username, and type are required" });
    }

    getLastCardId().then((lastCardId) => {
      const newCard = new ConvoCard({
        prompt,
        cardId: lastCardId + 1,
        username,
        type,
        likeCounter: 0,
        dislikeCounter: 0,
      });

      newCard.save((err, result) => {
        if (err) {
          // if duplicate key error, return a different error message
          if (err.code === 11000) {
            res.status(500).json({
              message: "Card already exists",
              err,
            });
          } else {
            console.log("err", err);
            res.status(500).json({
              message: "Error creating card",
              err,
            });
          }
        } else {
          res.status(200).redirect("/");
        }
      });
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.put("/rate", async (req, res) => {
  // rate card. Rating can be likeCounter or dislikeCounter and is incremented by 1 for each rating
  try {
    const { cardId, rating, user } = req.body;
    console.log("req.body", req.body);

    if (!cardId || !rating) {
      res.status(400).json({ message: "CardId and rating are required" });
    }

    const ratingResponse = await updateUserCardRating({
      cardId,
      email: user.email,
      rating,
    });

    if (!ratingResponse.success) {
      return res
        .status(400)
        .json({ ratingResponse: ratingResponse, response: null });
    }

    const response = ratingResponse.success
      ? await ConvoCard.findOneAndUpdate(
          { cardId },
          { $inc: { [rating]: 1 } },
          { new: true }
        )
      : null;

    console.log("response", response, rating, ratingResponse);

    res.status(200).json({ response, ratingResponse });
  } catch (err) {
    res.status(500).json({ message: "Error rating card", err });
  }
});

// when a user likes or dislikes a card, the UserCard model is updated
async function updateUserCardRating({ cardId, email, rating }) {
  try {
    console.log("updateUserCardRating", cardId, email, rating);
    const query = { email, cardId };

    const cardRating = await Usercard.findOne(query);

    //  check if cardId has already been rated by user. If it has been rated, return an error that the card has already been rated. If the card has not been rated, update the card rating
    console.log("cardRating", cardRating);
    if (cardRating?.rated) {
      return { message: "You have already rated the card", success: false };
    }

    const updateRating = Usercard({
      email,
      cardId,
      rated: true,
      liked: rating === "likeCounter" ? true : false,
      disliked: rating === "dislikeCounter" ? true : false,
    });

    const response = await updateRating.save();

    console.log("response", response);
    return { response, success: true };
  } catch (error) {
    throw new Error(error);
  }
}

// export router
module.exports = router;
