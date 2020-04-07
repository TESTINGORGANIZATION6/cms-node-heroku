const router = require('express').Router();

const {
    postmessage,
    getmessageById,
    getmessage
} = require('../controllers/slack');

router.post('/postmessage', postmessage);
router.get('/getmessage/:messageId', getmessage);

router.param('messageId', getmessageById);

module.exports = router;
