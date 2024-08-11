const mongoose = require("mongoose");

const filtercontactSchema = new mongoose.Schema({
  
  name: { type: String, required: false },
  website:  { type: String, required: false },
  companyName: { type: String, required: false },
  industry: { type: String, required: false },
  industry2: { type: String, required: false },
  Country:  { type: String, required: false },
  Region: { type: String, required: false },
  companyLinkedIn: { type: String, required: false },
  role:  { type: String, required: false },
  result:  { type: String, required: false },
  quality:  { type: String, required: false },
  free:  { type: String, required: false },
  date:  { type: String, required: false },
  


});

module.exports = mongoose.model("FilterContact", filtercontactSchema);
