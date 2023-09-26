const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  
  name: {
    type: String,
 
    required: true,
  }, 
  updated: {
    type: Date,
    
    required: true,
  }, 

  publish:{
    type:Boolean,
   default:false,
   required: true, 
  }
 
});




module.exports = mongoose.model('Brand', brandSchema);
                                           