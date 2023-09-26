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
  lastName:{
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
    enum : ["user","admin"],
    default: 'user',

  },

  company:{
    type: String,
    default: '',
  },
  
  website:{
    type: String,
    default: '',
  },
  
  name:{
    type: String,
    default: '',
  },
  
  email:{
    type: String,
    default: '',
  },
  bankname:{
    type: String,
    default: '',
  },
  
  profilePicture:{
    type: String,
    default: '',
  },
  balance:{
    type: Number,
    default: 0,
  },
  

  paymentMethod:{
    type: [String],
    default: 0,
  },
  
  avatar:{
    type:{},
    default: 0,
  },
  

  accountNumber:{
    type: String,
    default: "",
  },

  token: {
    type: String,
    default: ' ',
  }
});




module.exports = mongoose.model('User', userSchema);
