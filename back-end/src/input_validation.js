
/* VALIDATING THE INPUTS*/
const { check, validationResult } = require('express-validator');
const PasswordValidator = require('password-validator');




/*USER CREDENTIALS CHECKS */
const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)
    .is().max(50)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

const validateUsernameReq = check('username').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long');
const validateEmailReq = check('email').isEmail().withMessage('Invalid email format');
const validatePasswordReq = check('password').isLength({ min: 8, max: 50 }).withMessage('Password must be between 8 and 50 characters long')
    .custom((value) => {
        const passwordValidationErrors = passwordSchema.validate(value, { list: true });
        if (passwordValidationErrors.length > 0) {
            throw new Error('Password must be 8-50 characters long, with at least one uppercase, one lowercase, one digit, one symbol, and no spaces.');
        }
        return true;
    });

const validateAllReq = [
    validateUsernameReq,
    validateEmailReq,
    validatePasswordReq,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() });
        }
        next();
    }
];


/*THREADS */
const validateThreadTitle = check('title').exists().withMessage('Title is required')
    .isLength({ min: 10, max: 100 }).withMessage('Title must be between 10 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Title must contain only letters, numbers, and spaces')


module.exports = {
    validateUsernameReq,
    validatePasswordReq,
    validateAllReq,
    validateThreadTitle
};
