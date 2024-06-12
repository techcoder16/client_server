const mongoose = require("mongoose")
const User = require('../models/User');
const { databaseURL } = require('../config');
const bcrypt = require('bcrypt');

const connectDB = async () => {
  await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('Connected to MongoDB');
    
    
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
     
      const hashedPassword = await bcrypt.hash('123', 10); // Hash the password
      await User.create({ username: 'admin', password: hashedPassword,file:'none', role: 'admin',token:' ' ,email:"admin@gmail.com"});
    


    }
  




  }) .catch((error) => {
    console.error('MongoDB connection error:', error);
  });




}



module.exports = connectDB