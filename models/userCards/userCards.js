const mongoose = require("mongoose");

const userCardSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  cardId: {
    type: Number,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  disliked: {
    type: Boolean,
    default: false,
  },
  rated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Usercard", userCardSchema);
