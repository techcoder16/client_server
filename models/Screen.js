const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    default: 1,
  },
  screen_name: {
    type: String,

    required: true,
  },
  screen_url: {
    type: String,
    required: true,
  },
  menu_name: { type: mongoose.Types.ObjectId, ref: "Menu" },

 
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Screen", screenSchema);
