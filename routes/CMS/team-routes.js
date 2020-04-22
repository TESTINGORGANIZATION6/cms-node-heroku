const express = require('express')
const router = express.Router()

// import controllers
const {
    isAuth,
    requiredSignIn,
    userById
} = require('../../controllers/CMS/user');

const {
    addTeam,
    getTeam,
    getTeams,
    teamById,
    updateTeam,
    getAllTeams
} = require('../../controllers/CMS/team')

router.post('/addteam/:userId', requiredSignIn, isAuth, addTeam)
router.get('/getteams/:userId', requiredSignIn, isAuth, getTeams)
router.get('/getteam/:teamId/:userId', requiredSignIn, isAuth, getTeam)
router.put('/updateteam/:teamId/:userId', requiredSignIn, isAuth, updateTeam)
router.get('/getallteams/:userId', requiredSignIn, isAuth, getAllTeams)

router.param('userId', userById);
router.param('teamId', teamById);

module.exports = router
