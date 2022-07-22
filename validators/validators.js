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
                body("request.price", "Price must not be empty").not().isEmpty().isInt({ min:1}).withMessage('Price must be greater then zero.'),
                body("request.expiry_type", "Expiry Type must not be empty").not().isEmpty(),
                body("request.market_classification", "Market Classification must not be empty").not().isEmpty(),
                body("request.amount").optional(),
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