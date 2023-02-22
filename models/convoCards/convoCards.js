const mongoose = require("mongoose");

const convoCardSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    unique: true,
  },
  cardId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  likeCounter: {
    type: Number,
    default: 0,
  },
  dislikeCounter: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ConvoCard", convoCardSchema);
