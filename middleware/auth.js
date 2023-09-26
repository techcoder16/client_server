const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

  async function isTokenValid(token)  {

  token = token.split("Bearer ");
  

 token = token [1];
 
 
 const user =  await User.findOne({  token });


  if(user == null)
  {

    return false;
  }
    if (user.token === ' ' || !user || user == null || user.token === '') {
     
      return false;
    }
  
    try {
      const decoded = jwt.verify(token, config.secretKey);

      return true;
    } catch (error) {
    
      return false;
    }



  }



const verifyToken = async (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["authorization"]

  if (!token || await isTokenValid(token) == false) {
    
    res
      .status(400)
      .send({
        success: false,
        message: "A token is required for authentication",
      });
  }
  try {

  if(token)
  {

    token = token.split("Bearer ");
    let save_token = token [1];
    
    const descode = jwt.verify(save_token, config.secretKey);
    req.user = descode;
    return next();
  }

  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid token");

  }

  return next();
};
module.exports = verifyToken;