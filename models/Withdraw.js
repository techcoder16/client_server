const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({

    // userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
network:{ type: String, unique: true },
  currency:{ type: String, unique: true },

});

  module.exports = mongoose.model("Withdraw", withdrawSchema);

