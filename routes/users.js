var express = require('express');
var router = express.Router();
const auth                                  = require('../middleware/auth');
const { userValidationRules, validate }     = require('../validators/validators');
const UserController = require('../controllers/UserController');
const employeesDetails = require('../controllers/employeesDetails');
const companyDetail = require('../controllers/CompanyDetailController');


/* GET users listing. */
router.post('/signup', userValidationRules('signup'), UserController.milSignUp);
router.post('/login', userValidationRules('login'), validate, UserController.milSignIn);
router.post('/add-employees', userValidationRules('employees'), validate, employeesDetails.addEmployees);
router.post('/employees-list', validate, employeesDetails.getEmployeeList);
router.post('/update-employees-details', validate, employeesDetails.updateEmployeeDetails);
router.post('/get-employee-excel-file', validate, employeesDetails.getExcelFile);
router.post('/add-company', userValidationRules('company'), validate, companyDetail.addCompany);
router.post('/get-company-detail', validate, companyDetail.getCompanyDetail);
router.post('/add-salary', validate, employeesDetails.addSalary);
router.post('/get-employee-pdf', validate, employeesDetails.generatePdf);

router.post('/add-company-visits-details', validate, companyDetail.companyVisitsDetails);
router.post('/get-employee-company-visits-details', validate, companyDetail.getEmployeeVisitsList);

/**
 * APIS For attendance
 */
 router.post('/employee-attendance-opertaion', validate, employeesDetails.attendanceOpertaion);
 router.post('/get-absent-employee-details', validate, employeesDetails.getTodayAbsentEmployee);
module.exports = router;
