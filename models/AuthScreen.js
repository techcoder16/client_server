const mongoose = require("mongoose");

const authScreenSchema = new mongoose.Schema({
  screen_name: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
  username: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuthScreen", authScreenSchema);