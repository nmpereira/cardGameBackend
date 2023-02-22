const express = require("express");
const router = express.Router();
const ConvoCard = require("../../models/convoCards/convoCards");

const { requireAuth, requireAdmin } = require("../login/auth");

router.get("/", requireAdmin, (req, res) => {
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

router.get("/types", requireAdmin, async (req, res) => {
  try {
    const types = await cardTypes();
    res.status(200).json(types);
  } catch (err) {
    res.status(500).json({ message: "Error getting card types", err });
  }
});

router.get("/all", requireAdmin, async (req, res) => {
  try {
    // get all cards
    ConvoCard.find({}, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Error getting all cards", err });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (err) {
    console.log("error", err);
  }
});

module.exports = router;
