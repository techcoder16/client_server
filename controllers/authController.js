const User = require("../models/User");

const bcrypt = require("bcrypt");

const { secretKey } = require("../config");
const jwt = require("jsonwebtoken");
const AuthScreen = require("../models/AuthScreen");
const Contact = require('../models/Contact');

const user_login = async (req, res) => {
  const { emailnew, password } = req.body;

  try {
    
    const emailget = await User.findOne({ email:emailnew });
    
    if (!emailget) {
      return res.status(401).json({ message: "Invalid email or password" });

    }
    const passwordMatch = await bcrypt.compare(password, emailget.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: emailget._id,
        role: emailget.role,
      },

      secretKey,
      {
        expiresIn: "4h",
      }
    );
    const update = { token: token };

    let expireTime = "";
    const updatedValue = await User.updateOne(update);
    const decodedToken = jwt.decode(token);

    if (decodedToken && decodedToken.exp) {
      const expirationTime = decodedToken.exp;

      const expirationDate = new Date(expirationTime * 1000);
      expireTime = expirationDate;
    }
    const role = emailget.role;
    const name = emailget.name;
    const username = emailget.username;
    const email = emailget.email;
    const website = emailget.website;
    const company = emailget.company;
    const file = emailget.file;
    const address = emailget.address;
    const balance = emailget.balance;
    const _id = emailget._id.toString();
    const avatar = emailget.avatar;
  

  
   return  res.status(200).json({
      message: "Successfully Login",
      username,
      token,
      expireTime,
      role,
      name,
      email,
      website,
      company,
   
      file,
      address,
      balance,
      _id,
      avatar,


    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



const user_logout = async (req, res) => {
  const { email } = req.body;

  const filter = { email: email };
  try {
    const update = { token: " " };
    let doc = await User.findOneAndUpdate(filter, update);

    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const get_user = async (req, res) => {
  try {
    const user = await User.find({});

    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    } else {
      res.json({ message: "Successfully Get All Users", user });
    }
  } catch (err) {
    return res.status(401).json({ message: "User Error" });
  }
};

const create_user = async (req, res) => {
  const { username,email, password, role,type,address,phoneNumber } = req.body;

  
  try {


    if(type == 'google') 
    {
      if (username === "") {
        return res
          .status(401)
          .json({ message: "Cannot Create User with empty name" });
      }
  

 

    res.status(200).send({ message: "Sign Up Successfull!" });





    }
    else if  (type == 'facebook')
    {


    }
else
{
  
    if (username === "") {
      return res
        .status(401)
        .json({ message: "Cannot Create User with empty name" });
    }

    const checkSameUser = await User.findOne({ username: username });

    if (checkSameUser || checkSameUser &&  checkSameUser.length > 0) {
      return res
        .status(401)
        .json({ message: "Cannot Create User with same name" });
    }

    const result = await User.find().sort({ id: -1 }).limit(1);
    let id = 1;

    if (result[0] !== undefined) {
      id = parseInt(result[0].id) + 1;
    }
    id = id.toString();

    const saltRounds = 10;

    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      id: id,
      username: username,
      password: hashedPassword,
      email:email,
     address:address,
       phoneNumber:phoneNumber,

      file: "none",
      role: role,
      token: "",
    });

    res.status(200).send({ message: "User Created!" });
 
  }

 
 
  } catch (error) {
    console.log(error);
  }
};


const update_user_profile = async (req, res) => {
  try {
    const { firstname, lastname, email, paymentMethod, phoneNumber, ID, avatar, accountNumber ,bankname,title} = req.body;

    // Check if email is not empty before updating
    if (req.file) {
      const updateFields = {
       
        lastName: lastname,
        paymentMethod,
        phoneNumber,
        avatar: {
          filename: req.file.buffer,
          contentType: req.file.mimetype,
        },
      };

      if(firstname)
      {
        updateFields.firstName = firstname;

      }
      if(bankname)
      {
        updateFields.bankname = bankname;
      }

      if(accountNumber)
      {
        updateFields.accountNumber = accountNumber;
      }


      if(title)
      {
        updateFields.title = title;
      }
      if (email) {
        updateFields.email = email;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: ID },
        updateFields
      );

      return res.status(200).send({ message: "Profile Updated!" });
    } else {
      const updateFields = {
  
        lastName: lastname,
        paymentMethod,
        phoneNumber,
    
  

      };

      if(firstname)
      {
        updateFields.firstName = firstname;

      }


      if(accountNumber)
      {
        updateFields.accountNumber = accountNumber;
      }

      if(bankname)
      {
        updateFields.bankname = bankname;
      }

      if(title)
      {
        updateFields.title = title;
      }
      if (email) {
        updateFields.email = email;
      }


      const updatedUser = await User.findOneAndUpdate(
        { _id: ID },
        updateFields
      );

      return res.status(200).send({ message: "Profile Updated!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};



const update_user = async (req, res) => {
  const { username, role, ID,balance } = req.body;
  try {
    const filter = { _id: ID };

    const checkSameUser = await User.findOne({ username: username });

  
    if (username == "") {
      const newUser = await User.findOneAndUpdate(filter, {
        username,
        role,
        balance,
      });

      res.status(200).send({ message: "User Updated!" });
      return false;
    } else if (checkSameUser && checkSameUser.length > 0) {
      const newUser = await User.findOneAndUpdate(filter, {
        username,
        role,
        balance,
      });

      res.status(200).send({ message: "User Updated!" });
      return false;
    }

    const newUser = await User.findOneAndUpdate(filter, {
      username,
      role,
      balance,
    });

    res.status(200).send({ message: "User Updated!" });
  } catch (error) {
    console.log(error);
  }
};
const get_id_by_name = async (req, res) => {
  const { username } = req.params;

  try {
    const newUser = await User.findOne({ username: username });

    if (newUser) {
      res.status(200).send({ _id: newUser._id });
    } else {
      res.status(201).send({ _id: "" });
    }
  } catch (error) {
    res.status(201).send({ _id: "" });
  }
};

const get_user_by_basic_id = async (req, res) => {
  const { ID } = req.params;
  try {
    const newUser = await User.findOne({ _id: ID });

    if (newUser) {
      res.status(200).send({ username: newUser.username, _id: newUser._id });
    } else {
      res.status(201).send({ username: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ username: "", _id: "" });
  }
};

const get_user_by_id = async (req, res) => {
  const { ID } = req.params;
  
  try {
    const newUser = await User.findOne({ _id: ID });

    if (newUser) {
      res.status(200).send({ username: newUser.username, _id: newUser._id,user:newUser });
    } else {
      res.status(201).send({ username: "", _id: "" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).send({ username: "", _id: "" });
  }
};

const get_roles = (req, res) => {
  const roles = ["user", "admin"];

  res.json(roles);
};
const get_all_users = async (req, res) => {
  const { ID } = req.params;
  try {
    const newUser = await User.find(
      {
        $and: [{ id: { $ne: ID } }],
      },
      { username: 1, _id: 1 }
    );

    if (newUser) {
      res.status(200).send({ newUser });
    } else {
      res.status(201).send({ message: "No User Added" });
    }
  } catch (error) {
    res.status(201).send({ message: "No User Added" });
  }
};

const delete_user_by_id = (req, res) => {
  const { ID } = req.body;
  
  try {
    let newUser = User.findOneAndRemove({ _id: ID })
      .then((element) => {
        console.log("User deleted:", element);
      })
      .catch((error) => {
        console.error("Error deleting User:", error);
      });

    res.status(200).send({ message: "User Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "User Cannot be Deleted!" });
  }
};


const createAuthScreen = async (req, res) => {
  const { screen_name, username } = req.body;
  try {
    const result = await AuthScreen.find({
      username: username,
      screen_name: screen_name,
    });
    if (result && result.length > 0) {
      res.status(401).send({ message: "Cannot Assign Again!" });
      return false;
    }

    const authScreen = AuthScreen.create({ screen_name, username });
    res.status(200).send({ message: "Screen Authorized!" });
  } catch (error) {
    console.log(error);
  }
};

const deleteAuthScreen = async (req, res) => {
  const { ID } = req.body;

  try {
    let newAuthScreen = AuthScreen.findOneAndRemove({ _id: ID })
      .then((element) => {
        console.log("User deleted:", element);
      })
      .catch((error) => {
        console.error("Error deleting User:", error);
      });

    res.status(200).send({ message: "Screen Deleted from User!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Screen Cannot be Deleted from User!" });
  }
};

const getAuthScreens = async (req, res) => {
  try {
    const authuser = await AuthScreen.find({});

    if (!authuser) {
      return res.status(401).json({ message: "No User Found" });
    } else {
      res.json({
        message: "Successfully Get All Authenticated  Users",
        authuser,
      });
    }
  } catch (err) {
    return res.status(401).json({ message: "User Error" });
  }
};



const update_user_settings = async (req, res) => {
  const { username, password, company, email, name, website } =
    req.body;
    
  try {
    const filter = { username: username };

    const checkSameUser = await User.find({ username: username });
    const saltRounds = 10;

    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    if (checkSameUser.length > 0) {
      const newUser = await User.findOneAndUpdate(filter, {
        username: username,
        password: hashedPassword,
        company: company,
        email: email,
        name: name,
        website: website,
      });

      res.status(200).send({ message: "User Updated!" });
      return false;
    }
  } catch (err) {
    return res.status(401).json({ message: "User Error" });
  }
};

const  get_balance = async (req, res) => {
const {id} = req.params;

try
{
  const getUser = await User.findOne({_id:id});
  
  res.status(200).send({balance: getUser.balance});

}
catch (err)
{
  return res.status(401).json({ message: "User Error" });
}

};


const  create_contact = async (req, res) => {
  const {name,email,phone,desc} = req.body;

  try
  {
    const getUser = await Contact.create({name:name,email:email,phone:phone,desc:desc});
    
    res.status(200).send({ message: "Contact Information Saved!" });

  
  }
  catch (err)
  {
    console.log(err);
    return res.status(401).json({ message: "Contact Info Cannot be Saved!" });
  }
  
  };
  


  
const  getContacts = async (req, res) => {
  
  try
  {
    const contacts = await Contact.find({});
    res.status(200).send({contacts});
  }
  catch (err)
  {
    return res.status(401).json({ message: "Contact Error!" });
  }
  
  };
  

  


  
const  getAvatar = async (req, res) => {
  
  const {id} = req.params;

  try
  {
    const user = await User.find({_id:id},{avatar:1});
    res.status(200).send({user});
  }
  catch (err)
  {
    return res.status(401).json({ message: "  User Error!" });
  }
  
  };
  


  
const delete_contact = (req, res) => {
  const { ID } = req.body;
  
  try {
    let newUser =  Contact.findOneAndRemove({ _id: ID })
      .then((element) => {
        console.log("Contact deleted:", element);
      })
      .catch((error) => {
        console.error("Error Contact User:", error);
      });

    res.status(200).send({ message: "Contact Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Contact Cannot be Deleted!" });
  }
};


  
  


module.exports = {
  user_login,
  user_logout,
  get_user,
  create_user,
  delete_user_by_id,
  update_user,
  get_all_users,
  get_id_by_name,
  get_user_by_basic_id,
  get_user_by_id,
  get_roles,
  getAuthScreens,
  createAuthScreen,
  deleteAuthScreen,
  update_user_settings,
  get_balance,
  create_contact,
  getContacts,
  update_user_profile,
  getAvatar,
  delete_contact,
  
};
