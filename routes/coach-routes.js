const express = require('express');
const router = express.Router();

// Import controllers
const {
    coachById,
    addCoach,
    getCoach,
    getCoaches,
    updateCoach,
    updateStatus,
    deleteCoach
} = require('../controllers/coach');

const {
    requiredSignIn,
    isAuth,
    isAdmin,
    userById
} = require('../controllers/user')

router.post('/addcoach/:userId', requiredSignIn, isAuth, addCoach);
router.get('/getcoach/:coachId/:userId', requiredSignIn, isAuth, getCoach);
router.get('/getcoaches/:userId', requiredSignIn, isAuth, isAdmin, getCoaches);
router.put('/updatecoach/:coachId/:userId', requiredSignIn, isAuth, isAdmin, updateCoach);
router.delete('/deletecoach/:coachId/:userId', requiredSignIn, isAuth, isAdmin, deleteCoach);
router.put('/updatecoachstatus/:coachId/:userId', requiredSignIn, isAuth, isAdmin, updateStatus);

router.param('userId', userById);
router.param('coachId', coachById)

module.exports = router
