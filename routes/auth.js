const express = require('express');

const authMiddleware = require('../middleware/auth');

const cors = require('cors'); // Import the cors package

const router = express.Router();
const auth = require ('../controllers/authController');
require('../utils/passport');
const passport = require('passport');
const multer = require('multer');
const User = require('../models/User'); // Import your User model

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });






router.post('/logout', auth.user_logout );

const corsOpts = {
  origin: '*',
  credentials: true,
  methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type']
};
router.use(cors(corsOpts));

router.post('/login', auth.user_login );


router.post('/create_user', auth.create_user);
router.post('/update_user', auth.update_user);
router.post('/delete_user', auth.delete_user_by_id);
router.get('/get_user', auth.get_user);
router.get('/get_user_by_id/:ID',auth.get_user_by_id);
router.get('/get_user_list/:ID', auth.get_all_users);
router.get('/get_menu_by_oid/:ID', auth.get_user_by_basic_id);
router.get('/get_id_name/:username', auth.get_id_by_name);

router.get('/get_roles', auth.get_roles);
router.post('/update_user_settings',auth.update_user_settings);
router.get('/get_balance/:id', auth.get_balance);





router.get('/get_auth_screens', auth.getAuthScreens);

router.post('/delete_auth_screens', auth.deleteAuthScreen);

router.post('/create_auth_screens', auth.createAuthScreen);

router.post('/create_contact',auth.create_contact);


router.get('/get_contacts', auth.getContacts);
router.get('/get_avatar/:id', auth.getAvatar);


router.post('/update_user_profile', upload.single('avatar'), auth.update_user_profile);

router.post('/delete_contact',auth.delete_contact);




router.get('/test',authMiddleware,function (req, res) {

  try
  {

res.status(200).send({message: 'Test'});

  }
  catch(err){
    console.log(err);
  }


});
  
router.get('/callback', passport.authenticate('google', {

  failureRedirect: '/login' 
}),
(req, res) => {


  if (req.user && req.authInfo.message === 'User already exists') {
   
    res.status(200).send({message: 'User already exists'});
   return

  } else {

    
    res.status(400).send({message: 'Signup Successfully'});
    return
  }
  

  
});




router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));



  module.exports = router;