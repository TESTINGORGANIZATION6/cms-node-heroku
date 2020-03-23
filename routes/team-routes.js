const express = require('express')
const router = express.Router()

// import controllers
const {
    isAuth,
    requiredSignIn,
    userById
} = require('../controllers/user');

const {
    addTeam,
    getTeam,
    teamById
} = require('../controllers/team')

router.post('/addteam/:userId', requiredSignIn, isAuth, addTeam)
router.get('/getteam/:teamId/:userId', requiredSignIn, isAuth, getTeam)

router.param('userId', userById);
router.param('teamId', teamById);

module.exports = router
