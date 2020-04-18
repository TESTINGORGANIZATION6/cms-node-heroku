const router = require('express').Router();
const { getUsers, changeUserStatus } = require('../../controllers/Portfolio/portfolio-user');
const { portfolioUserStatusChangeValidator } = require('../../validator/app')
const {
    requiredSignIn,
    isAuth
} = require('../../controllers/user');

router.get('/cms-portfolio-api/getusers',requiredSignIn, getUsers);

router.post('/cms-portfolio-api/changeuserstatus',requiredSignIn, portfolioUserStatusChangeValidator, changeUserStatus);

module.exports = router;