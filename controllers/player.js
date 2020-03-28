const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Player = require('../models/players');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.playerById = (req, res, next, id) => {
    Player.findById(id).exec((err, player) => {
        if (err || !player) {
            return res.status(400).json({
                error: "Player not found"
            });
        }
        req.player = player;
        next();
    })
}

exports.getPlayer = (req, res) => {
    req.player.photo = undefined;
    return res.json(req.player);
}

exports.addPlayer = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // Validate the fields
        const {
            firstname,
            lastname,
            role,
            age,
            email,
            team,
            position
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email || 
            !team || 
            !position) {
                return res.status(400).json({
                    error: "All fields are required"
                })
        }

        let player = new Player(fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB"
                })
            }
            player.photo.data = fs.readFileSync(files.photo.path)
            player.photo.contentType = files.photo.type
        }

        player.save((err, result) => {
            if (err) {
                return re.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};

exports.getPlayers = (req, res) => {
    Player.find({ user: req.profile._id }).exec((err, players) => {
        if (err || players.length === 0) {
            return res.status(400).json({
                error: 'players not found'
            });
        }
        res.json(players)
    });
};

exports.deletePlayer = (req, res) => {
    let player = req.player;
    player.remove(err => {
        if (err) {
            res.status(400).json({
                error: 'players not found'
            });
        }
        res.json({
            message: 'player deleted'
        })
    });
};

exports.updatePlayer = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // Validate the fields
        const {
            firstname,
            lastname,
            role,
            age,
            email,
            team,
            position
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email || 
            !team || 
            !position) {
                return res.status(400).json({
                    error: "All fields are required"
                })
        }

        let player = req.player
        player = _.extend(player, fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB"
                })
            }
            player.photo.data = fs.readFileSync(files.photo.path)
            player.photo.contentType = files.photo.type
        }

        player.save((err, result) => {
            if (err) {
                return re.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};

exports.updateStatus = (req, res) => {
    status = req.player.isActive
    Player.findOneAndUpdate(
        { _id: req.player._id },
        { isActive: !status },
        { new: true }
    ).exec((err, player) => {
        if (err) {
            return res.status(400).json({
                error: 'player not found'
            });
        }
        player.photo = undefined;
        res.json(player)
    });
};
