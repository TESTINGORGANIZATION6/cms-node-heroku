exports.userSignupValidator = (req, res, next) => {
    req.check('username', 'Username is required').notEmpty()
    req.check('firstname', 'Firstname is required').notEmpty()
    req.check('lastname', 'Lastname is required').notEmpty()
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        })
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
    const errors = req.validationErrors()
    if (errors) {
        const error = errors.map(err => err.msg)[0]
        return res.status(400).json({ error: error })
    }
    next()
};



//***************************************PORTFOLIO VALIDATIONS****************************************************************** */
exports.portfolioUserStatusChangeValidator = (req, res, next) => {
    req.check('UserId', 'UserId is mandatory').notEmpty()
    req.check('Status', 'Status true or false is mandatory').notEmpty().isIn([true, false])
    const errors = req.validationErrors()
    if (errors) {
        const error = errors.map(err => err.msg)[0]
        return res.status(200).json({ status: false, message: error })
    }
    next()
}
//***************************************PORTFOLIO VALIDATIONS****************************************************************** */
