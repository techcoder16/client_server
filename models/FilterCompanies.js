const mongoose = require("mongoose");
const { Namespace } = require("socket.io");

const filterCompaniesSchema = new mongoose.Schema({


  companyLinkedIn: { type: String, required: false },
  name: { type: String, required: false },
  companyName: { type: String, required: false },
  website: { type: String, required: false },
  industry: { type: String, required: false },
  industry2: { type: String, required: false },
  Country: { type: String, required: false },
  Region: { type: String, required: false },





});

module.exports = mongoose.model("FilterCompanies", filterCompaniesSchema);
