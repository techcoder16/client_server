const Menu = require("../models/Menu");

const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find({});

    if (!menu) {
      return res.status(401).json({ message: "No Menu Found" });
    } else {
      res.json({ message: "Successfully Get All Menus", menu });
    }
  } catch (err) {
    return res.status(401).json({ message: "Menu Error" });
  }
};

const createMenu = async (req, res) => {
  const { menu_name, level, children, parent } = req.body;
  
  try {

    if(menu_name ==="")
    {   return res
      .status(401)
      .json({ message: "Cannot Create menu with empty name" });
      
    }
    const checkSameMenu = await Menu.findOne({ menu_name: menu_name });

    if (checkSameMenu) {
      return res
        .status(401)
        .json({ message: "Cannot Create menu with same name" });
    }

    const result = await Menu.find().sort({ id: -1 }).limit(1);
    let id = 1;

    if (result[0] == undefined) {
    } else {
      id = parseInt(result[0].id) + 1;
    }
    id = id.toString();

    const menu = Menu.create({
      id,
      menu_name,
      level,
      children,
      parent: parent == id ? 0 : parent,
    });
    res.status(200).send({ message: "Menu Created!" });
  } catch (error) {
    console.log(error);
  }
};
const updateMenubyID = async (req, res) => {
  const { menu_name, level, children, parent, id } = req.body;
  try {
    const filter = { id: id };

    const checkSameMenu = await Menu.findOne({ menu_name: menu_name });

    if (menu_name == "") {
      const menu = await Menu.findOneAndUpdate(filter, {
        level,
        children,
        parent,
      });

      res.status(200).send({ message: "Menu Updated!" });
      return false;

    }
    else if (checkSameMenu) {
      const menu = await Menu.findOneAndUpdate(filter, {
        level,
        children,
        parent,
      });

      res.status(200).send({ message: "Menu Updated!" });
      return false;
      
    }

    const menu = await Menu.findOneAndUpdate(filter, {
      menu_name,
      level,
      children,
      parent,
      id,
    });
   

    res.status(200).send({ message: "Menu Updated!" ,menu: menu });
  } catch (error) {
    console.log(error);
  }
};
const getIdbyName = async (req, res) => {
  const { menu_name } = req.params;

  try {
    const menu = await Menu.findOne({ menu_name: menu_name });
   
    if (menu) {
      res.status(200).send({ id: menu.id, _id: menu._id });
    } else {
      res.status(201).send({ id: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ id: "", _id: "" });
  }
};

const getMenubyBasicId = async (req, res) => {
  const { ID } = req.params;
  try {
    const menu = await Menu.findOne({ _id: ID });

    if (menu) {
      res.status(200).send({ menu_name: menu.menu_name, _id: menu._id });
    } else {
      res.status(201).send({ menu_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ menu_name: "", _id: "" });
  }
};


const getMenubyId = async (req, res) => {
  const { ID } = req.params;
  try {
    const menu = await Menu.findOne({ id: ID });

    if (menu) {
      res.status(200).send({ menu_name: menu.menu_name, _id: menu._id });
    } else {
      res.status(201).send({ menu_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ menu_name: "", _id: "" });
  }
};


const getAllMenus = async (req, res) => {
  const { ID } = req.params;
  try {
    const menu = await Menu.find(
      {
        $and: [{ id: { $ne: ID } }],
      },
      { menu_name: 1, _id: 1 }
    );

    if (menu) {
      res.status(200).send({ menu });
    } else {
      res.status(201).send({ message: "No menu Added" });
    }
  } catch (error) {
    res.status(201).send({ message: "No menu Added" });
  }
};

const deleteMenuById = (req, res) => {
  const { ID } = req.body;
  try {
    let menu = Menu.findOneAndRemove({ id: ID })
      .then((element) => {
        console.log("Menu deleted:", element);
      })
      .catch((error) => {
        console.error("Error deleting menu:", error);
      });

    res.status(200).send({ message: "Menu Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Menu Cannot be Deleted!" });
  }
};

module.exports = {
  getMenu,
  createMenu,
  updateMenubyID,
  deleteMenuById,
  getMenubyId,
  getAllMenus,
  getIdbyName,
  getMenubyBasicId,


};
