const express = require('express');
const router = express.Router();

const screen = require ('../controllers/screenController');




router.post('/create_screen', screen.createScreen);
router.post('/update_screen', screen.updateScreenbyID);
router.post('/delete_screen', screen.deleteScreenById);
router.get('/get_screen', screen.getScreen);
router.get('/get_screen_by_id/:ID', screen.getScreenbyId);
router.get('/get_screen_by_object_id/:ID', screen.getScreenbyObjectId);


router.get('/get_screen_list/:ID', screen.getAllScreens);
router.get('/get_screen_id_by_name/:screen_name', screen.getIdbyName);


module.exports = router;

