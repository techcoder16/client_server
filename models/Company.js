const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({


  companyName  : {type: String, required: false, }, 
  duplicate: {type: Boolean,default: "",}, 
   website  : {type: String,default: "",}, 
    industry : {type: String,default: "",}, 
    industry2 : {type: String,default: "",}, 
    companyLinkedIn : {type: String,default: "",},
    Region:{type:String,default: "",},
    Country:{type:String,default: "",},
    name:{type:String,default: "",},
    date:{type:Date,default: "",},
    
});




module.exports = mongoose.model('Company', companySchema);
                                          