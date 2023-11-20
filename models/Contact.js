const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  
  srno: { type: Number, required: false },
  date: { type: String, required: false },
  

  name: { type: String, required: false },
  industry1: { type: String, required: false },
  
  industry2: { type: String, required: false },
  
  empcount: { type: Number, required: false },

  phoneNumber: { type: String, required: false },
  website: { type: String, required: false },
  
  
  companyLinkedin: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  country: { type: String, required: false },
  
  
  
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },

  jobRole: { type: String, required: false },

  
  email: { type: String, required: false },
  
  
  quality: { type: String, required: false },
  
  
  result: { type: String, required: false },
  
  
  free: { type: String, required: false },
  
  
  role: { type: String, required: false },
  
  phoneNumber2: { type: String, required: false },
  
  linkedin: { type: String, required: false },

  remarks:{type:String, required: false},
  recordMarksheet:{type:String, required: false},
  

  duplicate: { type: Boolean, default: false },
  


});

module.exports = mongoose.model("Contact", contactSchema);
