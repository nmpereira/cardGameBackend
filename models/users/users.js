const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
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
  role: { type: String, default: "user" },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
