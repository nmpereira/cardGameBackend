// create basic CRUD routes

const express = require("express");
const router = express.Router();

// import routes
const convoCards = require("../convoCards/convoCards");
router.use("/convocards", convoCards);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to prompts" });
});

// export router
module.exports = router;
