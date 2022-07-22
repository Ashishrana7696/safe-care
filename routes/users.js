var express = require('express');
var router = express.Router();
const auth                                  = require('../middleware/auth');
const { userValidationRules, validate }     = require('../validators/validators');
const UserController = require('../controllers/UserController')


/* GET users listing. */
router.post('/signup', userValidationRules('signup'), UserController.milSignUp);
router.post('/login', userValidationRules('login'), validate, UserController.milSignIn);

module.exports = router;
