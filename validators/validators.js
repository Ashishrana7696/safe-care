const { body, validationResult } = require('express-validator');

const userValidationRules = (formRequest) => {
    switch (formRequest) {
        case "login":
            return [
                // names must be 1 or more
                body('email', 'email is required').isEmail(),
                body('password').isLength({ min: 5 }),
            ];
            break;
        case "signup":
            return [
                // username must be an email
                body('email', 'email is required').isEmail(),
                // password must be at least 5 chars long
                body('password').isLength({ min: 5 }),
                body("last_name", "password must not be empty").not().isEmpty(),
                body("first_name", "username must not be empty").not().isEmpty(),
            ];
            break;
        case "initiate-equity-order":
            return [
                body("request.available_quantity", "available_quantity must not be empty").optional(),
                body("request.account_number", "password must not be empty").not().isEmpty(),
                body("request.action", "action must not be empty").not().isEmpty().isIn(['buy', 'sell']).withMessage('Action Value Is Not Valid'),
                body("request.stock_symbol", "stock symbol must not be empty").not().isEmpty(),
                body("request.order_type", "Order type must not be empty").not().isEmpty(),
                body("request.price", "Price must not be empty").not().isEmpty().isInt({ min: 1 }).withMessage('Price must be greater then zero.'),
                body("request.expiry_type", "Expiry Type must not be empty").not().isEmpty(),
                body("request.market_classification", "Market Classification must not be empty").not().isEmpty(),
                body("request.amount").optional(),
            ];
            break
        case "employees":
            return [
                body("last_name", "last name must not be empty").not().isEmpty(),
                body("first_name", "first name must not be empty").not().isEmpty(),
                body("pan_number", "pan number must not be empty").not().isEmpty(),
                body("aadhar_number", "aadhar number must not be empty").not().isEmpty(),
                body("address", "address must not be empty").not().isEmpty(),
                body("doj", "doj must not be empty").not().isEmpty(),
                body("department", "department must not be empty").not().isEmpty(),
                body("phone_number", "phone number must not be empty").not().isEmpty()
            ];
            break
            case "company":
                return [
                    body("email", "email must not be empty").isEmail(),
                    body("company_name", "company name must not be empty").not().isEmpty(),
                    body("company_address", "pan number must not be empty").isLength({ min: 10, max: 20 }),
                    body("company_address", "Enter Valid Adress").isLength({ min: 10, max: 20 }),
                    body("phone_number", "phone number must not be empty").not().isEmpty(),
                    body("phone_number", "phone number must not be of 9 digit").isLength({ min: 9, max: 9 }),
                    body("phone_number", "phone number must be number").isNumeric(),
                ];
                break
        default:
            return [];
            break;
    }

}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    validate,
}