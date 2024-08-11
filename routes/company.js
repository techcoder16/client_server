const express = require('express');
const router = express.Router();


const multer = require('multer');


const company = require ('../controllers/companyController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      
      cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage });







router.post('/create_company', company.createcompany);
router.post('/update_company', company.updatecompanybyID);
router.post('/delete_company', company.deletecompanyById);
router.get('/get_company/:payload', company.getcompany);

router.get('/get_company_by_id/:ID', company.getcompanybyId);
router.get('/get_company_list/:ID', company.getAllcompanys);
router.get('/get_company_by_oid/:ID', company.getcompanybyBasicId);
router.get('/get_id_name/:company_name', company.getIdbyName);
router.get('/get_filters/:payload',company.getFilterData);

router.get('/get_number_of_companies',company.getNumberOfData);

router.post('/upload', upload.single('file'),company.upliftData);
router.get('/get_company_count_by_industry', company.getCompanyCountByIndustry1);

// Route to get company count by industry2
router.get('/get_company_count_by_industry_2', company.getCompanyCountByIndustry2);

module.exports = router;

