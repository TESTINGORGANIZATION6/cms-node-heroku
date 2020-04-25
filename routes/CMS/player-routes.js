const express = require('express');
const router = express.Router();

// Import controllers
const {
    playerById,
    getPlayer,
    addPlayer,
    getPlayers,
    deletePlayer,
    updatePlayer,
    updateStatus,
    availablePlayers,
    updatePlayerinTeam,
    getTeamParam
} = require('../../controllers/CMS/player');

const {
    requiredSignIn,
    isAuth,
    isAdmin,
    userById
} = require('../../controllers/CMS/user');

router.get('/getplayer/:playerId/:userId', requiredSignIn, isAuth, getPlayer);
router.post('/addplayer/:userId', requiredSignIn, isAuth, addPlayer);
router.get('/getplayers/:userId', requiredSignIn, isAuth, isAdmin, getPlayers);
router.delete('/deleteplayer/:playerId/:userId', requiredSignIn, isAuth, isAdmin, deletePlayer);
router.put('/updateplayer/:playerId/:userId', requiredSignIn, isAuth, isAdmin, getTeamParam, updatePlayerinTeam, updatePlayer);
router.put('/updateplayerstatus/:playerId/:userId', requiredSignIn, isAuth, isAdmin, updateStatus);
router.get('/availableplayers/:userId', requiredSignIn, isAuth, isAdmin, availablePlayers);

router.param('userId', userById);
router.param('playerId', playerById);

module.exports = router;
