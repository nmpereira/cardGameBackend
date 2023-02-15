// create routes for convoCards

const express = require("express");
const router = express.Router();
const ConvoCard = require("../../models/convoCards/convoCards");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to convoCards" });
});

// get list of all card types from db
const cardTypes = () => {
  return new Promise((resolve, reject) => {
    ConvoCard.distinct("type", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

router.get("/types", async (req, res) => {
  try {
    const types = await cardTypes();
    res.status(200).json(types);
  } catch (err) {
    res.status(500).json({ message: "Error getting card types", err });
  }
});

router.get("/all", async (req, res) => {
  // get all cards
  ConvoCard.find({}, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error getting all cards", err });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/random", (req, res) => {
  // get single random card that is excluded from excludedCards array. Excluded cards are passed in as a body parameter in the form of an comma separated string
  const { excludedCards, type } = req.query;

  //   convert excludedCards string to array of numbers
  const excludedCardIds = excludedCards
    ? excludedCards.split(",").map((cardId) => parseInt(cardId))
    : [];

  if (!type) {
    res.status(400).json({ message: "Type is required" });
  }

  console.log(excludedCardIds, type);

  ConvoCard.aggregate(
    [
      { $match: { cardId: { $nin: excludedCardIds }, type } },
      { $sample: { size: 1 } },
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error getting random card", err });
      } else {
        if (result.length > 0) {
          res.status(200).json({ message: result[0], excludedCardIds });
        } else {
          res.status(200).json({ message: "No cards left", excludedCardIds });
        }
      }
    }
  );
});

// get last cardId
const getLastCardId = async () => {
  // get last cardId but if there are no cards, return 0
  const lastCard = await ConvoCard.findOne({}).sort({ cardId: -1 }).exec();
  return lastCard ? lastCard.cardId : 0;
};

router.post("/", (req, res) => {
  // create new card with a incremented cardId
  const { prompt, username, type } = req.body;

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
          console.log(err);
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
});

// export router
module.exports = router;
