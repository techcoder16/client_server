const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  date: { type: Date, required: false },
  name: { type: String, required: false },
  website: { type: String, required: false },
  industry1: { type: String, required: false },
  industry2: { type: String, required: false },
  empcount: { type: Number, required: false },
  phoneNumber: { type: Number, required: false },
  linkedin: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  country: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  duplicate: { type: Boolean, default: "" },
  jobRole: { type: String, required: false },
  email: { type: String, required: false },
});

module.exports = mongoose.model("Contact", contactSchema);
