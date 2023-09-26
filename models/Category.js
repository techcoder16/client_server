const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  }, 
  item: {
    type: [String],
    default: [],

  }, 
  
  image_url: {
    type: String,
    default: "",
  },
 
  menu_title: {
    type: String,
    default: "",
  },
 
  menu_desc: {
    type: String,
    default: "",
  },
 
   publish: {
    type: Boolean,
    default: false,
  },
 
  
 
 
   hide_in_navigation: {
    type: Boolean,
    default: false,
  },
 

  desc: {
    type: String,
    default: "",
  },
 
  
   thumb_url: {
    type: String,
    default: "",
  },

  parent :{
    type: mongoose.Types.ObjectId, ref: "Category", default: null 
  },
  
  
  child:[ { type: mongoose.Types.ObjectId, ref: "Category", default: null }]



 
});




module.exports = mongoose.model('Category', categorySchema);
                                           