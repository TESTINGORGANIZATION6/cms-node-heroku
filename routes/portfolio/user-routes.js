const router = require('express').Router();
const { getUsers, changeUserStatus } = require('../../controllers/Portfolio/portfolio-user');
const { portfolioUserStatusChangeValidator,getUsersValidator } = require('../../validator/app')
const {
    requiredSignIn,
    isAuth,
    userById
} = require('../../controllers/CMS/user');

router.post('/cms-portfolio-api/getusers/:userId',requiredSignIn,isAuth,getUsersValidator, getUsers);

router.post('/cms-portfolio-api/changeuserstatus/:userId',requiredSignIn,isAuth, portfolioUserStatusChangeValidator, changeUserStatus);

router.param('userId', userById);

module.exports = router;