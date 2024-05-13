const express = require('express');
const app = express();

const path=require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const session = require('express-session'); // Import the express-session package
const socketIO = require("socket.io");
const http = require("http");

const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require("./utils/db");

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const screenRoutes = require('./routes/screen');
const companyRoutes = require('./routes/company');
const contactRoutes = require('./routes/contact');
const config = require('./config');


var passport    = require('passport');


const cookieSession = require("cookie-session");



connectDB();

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration




app.use(express.json());



app.use(express.urlencoded({ extended: true  }));
app.use(bodyParser.json());
//api to get data from the server
app.get("/",(req, res)=>{res.json({ message: "Welcome to store server." });});


app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET, // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
}));


app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/screen', screenRoutes);
app.use('/company', companyRoutes);
app.use('/contact', contactRoutes);

const server = app.listen(config.port, () => {
  console.log(`Server Connected to port ${config.port}`);
});




// const io = socketIO(server,{

  
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"]
//     }
// });






process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
  
  })






