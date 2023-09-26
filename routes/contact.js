const express = require('express');
const router = express.Router();

const contact = require ('../controllers/contactController');


router.post('/create_contact', contact.createContact);
router.post('/update_contact', contact.updateContactbyID);
router.post('/delete_contact', contact.deleteContactById);
router.get('/get_contact/:payload', contact.getContact);
router.get('/get_contact_by_id/:ID', contact.getContactbyId);
router.get('/get_contact_list/:ID', contact.getAllContacts);
router.get('/get_contact_by_oid/:ID', contact.getContactbyBasicId);
router.get('/get_id_name/:contact_name', contact.getIdbyName);
router.get('/get_filters',contact.getAllFilters);


router.post('/uplift_data', contact.upliftData);

module.exports = router;

