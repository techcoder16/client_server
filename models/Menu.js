const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  id:{
    type:Number,
    unique:true,
    default:1,
    
  },
  menu_name: {
    type: String,
 
    required: true,
  },
  level: {
    type: Number,
    required: true,

  },
  parent: {
    
    type: Number,
    required: false,
    default: '0',
  },
  date_created:{
    type: Date,
    default: Date.now,
  }
});




module.exports = mongoose.model('Menu', menuSchema);
