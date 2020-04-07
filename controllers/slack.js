const Question = require('../models/queries');
const Slack = require('slack-node');
const { errorHandler } = require('../helpers/dbErrorHandler');

webhookUri = process.env.SLACK_URI
let slack = new Slack();
slack.setWebhook(webhookUri)

exports.postmessage = (req, res) => {
    const message = new Question(req.body)
    message.save((err, response) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: errorHandler(err)
            })
        }
        slack.webhook({
            channel: "#general",
            username: "coderlust",
            text: `Hey Guys, Here is the new query for you. <${process.env.SITE_URL}/getmessage/${response._id}|Click here> for details`
        }, (err, response) => {
            console.log(err);
            if (!err) {
                console.log(response);
            }
        });
        res.json({
            success: true
        })
    });
};

exports.getmessageById = (req, res, next, id) => {
    Question.findById(id).exec((err, message) => {
        if (err || !message) {
            return res.status(400).json({
                error: "message not found"
            })
        }
        req.message = message;
        next()
    });
};

exports.getmessage = (req, res) => {
    return res.json(req.message);
}
