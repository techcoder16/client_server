const AuthScreen = require("../models/AuthScreen");

const Screen = require("../models/Screen");

const getScreen = async (req, res) => {
  try {
    const screen = await Screen.find({});

    if (!screen) {
      return res.status(401).json({ message: "No Screen Found" });
    } else {
     return  res.json({ message: "Successfully Get All Screens", screen });
    }J
  } catch (err) {
    return res.status(401).json({ screen: "Screen Error" });
  }
};

const createScreen = async (req, res) => {
  const { screen_name, screen_url, menu_name } = req.body;
  try {
    if (screen_name === "") {
      return res
        .status(401)
        .json({ message: "Cannot Create Screen with empty name" });
    }
    const checkSameScreen = await Screen.findOne({ screen_name: screen_name });

    const checkSameMenu = await Screen.findOne({ menu_name: menu_name });

    if (checkSameMenu && menu_name) {
      res.status(401).send({ message: "Menus Can only have on Screens!" });
      return false;
    }
    if (checkSameScreen) {
      return res
        .status(401)
        .json({ message: "Cannot Create Screen with same name" });
    }

    const result = await Screen.find().sort({ id: -1 }).limit(1);
    let id = 1;

    if (result[0] == undefined) {
    } else {
      id = parseInt(result[0].id) + 1;
    }
    id = id.toString();
    const screen = Screen.create({ id, screen_name, screen_url, menu_name });
    res.status(200).send({ message: "Screen Created!" });
  } catch (error) {}
};

const updateScreenbyID = async (req, res) => {
  const { screen_name, screen_url, menu_name, ID } = req.body;
  try {
    var query = {
      screen_name: screen_name,
      screen_url: screen_url,
      menu_name: menu_name,
    };

    const filter = { id: ID };
    const checkSameScreen = await Screen.findOne({ screen_name: screen_name });

    const checkSameMenu = await Screen.findOne({ menu_name: menu_name });
    if (checkSameMenu) {
      res.status(401).send({ message: "Menus Can only have on Screens!" });
      return false;
    }
    if (screen_name == "") {
      const screen = await Screen.findOneAndUpdate(filter, {
        screen_url,
        menu_name,
      });

      res.status(200).send({ message: "Screen Updated!" });
      return false;
    } else if (checkSameScreen) {
      const screen = await Screen.findOneAndUpdate(filter, {
        screen_url,
        menu_name,
      });

      res.status(200).send({ message: "Screen Updated!" });
      return false;
    }

    let screen = Screen.findOneAndUpdate(filter, query)
      .then((element) => {})
      .catch((error) => {});

    res.status(200).send({ message: "Screen Updated!" });
  } catch (error) {}
};

const deleteScreenById = (req, res) => {
  const { ID } = req.body;
  try {
    let screen = Screen.findOneAndRemove({ id: ID })
      .then((element) => {})
      .catch((error) => {
        console.error("Error deleting Screen:", error);
      });

    res.status(200).send({ message: "Screen Deleted!" });
  } catch (error) {}
};

const getIdbyName = async (req, res) => {
  const { screen_name } = req.params;

  try {
    const screen = await Screen.findOne({ screen_name: screen_name });

    if (screen) {
      res.status(200).send({ id: screen.id, _id: screen._id });
    } else {
      res.status(201).send({ id: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ id: "", _id: "" });
  }
};

const getScreenbyId = async (req, res) => {
  const { ID } = req.params;
  try {
    const screen = await Screen.findOne({ id: ID });

    if (screen) {
      res
        .status(200)
        .send({ screen_name: screen.screen_name, _id: screen._id });
    } else {
      res.status(201).send({ screen_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ screen_name: "", _id: "" });
  }
};

const getScreenbyObjectId = async (req, res) => {
  const { ID } = req.params;
  try {
    const screen = await Screen.findOne({ _id: ID });

    if (screen) {
      res
        .status(200)
        .send({ screen_name: screen.screen_name, _id: screen._id });
    } else {
      res.status(201).send({ screen_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ screen_name: "", _id: "" });
  }
};

const getAllScreens = async (req, res) => {
  const { ID } = req.params;
  try {
    const screen = await Screen.find(
      {
        $and: [{ id: { $ne: ID } }],
      },
      { screen_name: 1, _id: 1 }
    );

    if (screen) {
      res.status(200).send({ screen });
    } else {
      res.status(201).send({ message: "No Screen Added!" });
    }
  } catch (error) {
    res.status(201).send({ message: "No Screen Added!" });
  }
};

const get_screen_by_UserId = async (req, res) => {
  const { ID } = req.params;
  try {
    const authscreen = await AuthScreen.find({ _id: ID });

    if (!authscreen) {
      return res.status(401).json({ message: "No User Found" });
    } else {
      res.json({
        message: "Successfully Get All Auth Screen by ID",
        authscreen,
      });
    }
  } catch (err) {
    return res.status(401).json({ message: "User Error" });
  }
};

const authScreenRights = async (req, res) => {
  try {

    

    const { user_id, screen_name } = req.query;


    const get_screen = await Screen.findOne(
      { screen_url: screen_name },
      { _id: 1 }
    );

      

    if (get_screen) {
      const containAuth = await AuthScreen.findOne({ screen_name: get_screen._id,username:user_id });
      
      
      if (containAuth) {
        
        return res.status(200).send(true);
        

      } else {
        return res.status(201).send(false);
      }
    } else {

      return res.status(201).send(false);
      
    }
  } catch (error) {

      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' });


  }
};

module.exports = {
  getScreen,
  createScreen,
  updateScreenbyID,
  deleteScreenById,
  getScreenbyId,
  getAllScreens,
  getIdbyName,
  getScreenbyObjectId,
  authScreenRights,

  get_screen_by_UserId,
};
