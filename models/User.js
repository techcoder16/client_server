const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  firstName:{
    type: String,
    required: false,
  },
  email:{
    type: String,
    required: false,
  },
  address:{
    type: String,
    required: false,
  },
  
  phoneNumber:{
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 1024

  },
  file: {
    data: Buffer,
    contentType: String,
   
  },
  role: {
    type: String,
    required: false,

    default: 'user',

  },

 
  
  
  name:{
    type: String,
    default: '',
  },



  token: {
    type: String,
    default: ' ',
  }
});




module.exports = mongoose.model('User', userSchema);
