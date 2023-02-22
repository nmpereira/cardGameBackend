// create basic CRUD routes

const express = require("express");
const router = express.Router();
const adminRoutes = require("../convoCards/adminRoutes");
const { requireAdmin, requireAuth } = require("../login/auth");

// import routes
const convoCards = require("../convoCards/convoCards");
router.use("/", requireAuth, convoCards);
router.use("/protected", requireAdmin, adminRoutes);

router.get("/*", (req, res) => {
  res.status(200).json({ message: "You're not supposed to be here, are you?" });
});

// export router
module.exports = router;
