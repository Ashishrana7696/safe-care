var express = require('express');
var router = express.Router();
const auth                                  = require('../middleware/auth');
const { userValidationRules, validate }     = require('../validators/validators');
const UserController = require('../controllers/UserController');
const employeesDetails = require('../controllers/employeesDetails');


/* GET users listing. */
router.post('/signup', userValidationRules('signup'), UserController.milSignUp);
router.post('/login', userValidationRules('login'), validate, UserController.milSignIn);
router.post('/add-employees', userValidationRules('employees'), validate, employeesDetails.addEmployees);
router.post('/employees-list', validate, employeesDetails.getEmployeeList);
router.post('/update-employees-details', validate, employeesDetails.updateEmployeeDetails);
module.exports = router;
