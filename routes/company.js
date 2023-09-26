const express = require('express');
const router = express.Router();

const company = require ('../controllers/companyController');







router.post('/create_company', company.createcompany);
router.post('/update_company', company.updatecompanybyID);
router.post('/delete_company', company.deletecompanyById);
router.get('/get_company/:payload', company.getcompany);

router.get('/get_company_by_id/:ID', company.getcompanybyId);
router.get('/get_company_list/:ID', company.getAllcompanys);
router.get('/get_company_by_oid/:ID', company.getcompanybyBasicId);
router.get('/get_id_name/:company_name', company.getIdbyName);
router.get('/get_filters',company.getFilterData);

router.post('/uplift_data', company.upliftData);


module.exports = router;

