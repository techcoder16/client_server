const express = require('express');
const router = express.Router();

const menu = require ('../controllers/menuController');




router.post('/create_menu', menu.createMenu);
router.post('/update_menu', menu.updateMenubyID);
router.post('/delete_menu', menu.deleteMenuById);
router.get('/get_menu', menu.getMenu);
router.get('/get_menu_by_id/:ID', menu.getMenubyId);
router.get('/get_menu_list/:ID', menu.getAllMenus);
router.get('/get_menu_by_oid/:ID', menu.getMenubyBasicId);
router.get('/get_id_name/:menu_name', menu.getIdbyName);
module.exports = router;

