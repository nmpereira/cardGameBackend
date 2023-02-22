const express = require("express");
const router = express.Router();
const ConvoCard = require("../../models/convoCards/convoCards");

router.get("/", (req, res) => {
  try {
    const { excludedCards, type } = req.query;

    //   convert excludedCards string to array of numbers

    console.log("excludedCards", req.query);
    console.log("excludedCardstype", typeof excludedCards, excludedCards);
    const excludedCardIds = excludedCards
      ?.split(",")
      .map((id) => (id ? parseInt(id) : null))
      .filter((id) => id !== null)
      .filter((value, index, array) => array.indexOf(value) === index);
    console.log("excludedCardIds", typeof excludedCardIds, excludedCardIds);

    if (!type) {
      res.status(400).json({ message: "Type is required" });
    }

    ConvoCard.aggregate(
      [
        {
          $match: {
            cardId: { $nin: excludedCardIds },
            type,
            // verified: true
          },
        },
        { $sample: { size: 1 } },
      ],
      (err, result) => {
        if (err) {
          console.log("err", err);
          res.status(500).json({ message: "Error getting random card", err });
        } else {
          if (result.length > 0) {
            res.status(200).json({ message: result[0], excludedCardIds });
          } else {
            res.status(200).json({ message: false, excludedCardIds });
          }
        }
      }
    );
  } catch (err) {
    console.log("error", err);
  }
});

module.exports = router;
