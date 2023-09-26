require('dotenv').config();

module.exports = {
  secretKey: process.env.SECRET_KEY,
  databaseURL: process.env.DATABASE_URL,
  port:process.env.PORT
};  