const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Player = require('../models/players');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.playerById = (req, res, next, id) => {
    Player.findById(id)
        .populate('team', '_id name')
        .exec((err, player) => {
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
            position
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email || 
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
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            result.populate('team', '_id name')
                .execPopulate((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(result)
                });
        });
    });
};

// query params = ?orderBy=createdAt&sortBy=desc&limit=3
exports.getPlayers = (req, res) => {
    const order = req.query.orderBy ? req.query.orderBy : 'asc';
    const sort = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1)*limit

    Player.find({ user: req.profile._id })
        .select('-photo')
        .sort([[ sort, order ]])
        .populate('team', '_id name')
        .limit(limit)
        .skip(skip)
        .exec((err, players) => {
            // To do, make this in one query
            Player.countDocuments({ user: req.profile._id })
                .exec((error, totalPages) => {
                    if (!error) {
                        if (err) {
                            return res.status(400).json({
                                error: 'players not found'
                            });
                        }
                        res.json({
                            totalPages: Math.ceil(totalPages/limit),
                            page,
                            result: players
                        });
                    }
                });
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
            position
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email || 
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
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            result.populate('team', '_id name')
                .execPopulate((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(result)
                });
        });
    });
};

exports.updateStatus = (req, res) => {
    status = req.player.isActive
    Player.findOneAndUpdate(
        { _id: req.player._id },
        { isActive: !status },
        { new: true }
    )
    .populate('team', '_id name')
    .exec((err, player) => {
        if (err) {
            return res.status(400).json({
                error: 'player not found'
            });
        }
        player.photo = undefined;
        res.json(player)
    });
};

// query params = ?orderBy=createdAt&sortBy=desc&limit=3&maxAge=100&minAge=0
exports.availablePlayers = (req, res) => {
    const order = req.query.orderBy ? req.query.orderBy : 'asc';
    const sort = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1)*limit
    const minAge = req.query.minAge ? req.query.minAge : 0
    const maxAge = req.query.maxAge ? req.query.maxAge : 100

    Player.find({ 
            user: req.profile._id,
            team: null,
            age: { $gt: minAge, $lt: maxAge }
        })
        .select('-photo -team')
        .sort([[ sort, order ]])
        .limit(limit)
        .skip(skip)
        .exec((err, players) => {
            // To do, make this in one query
            Player.countDocuments({ user: req.profile._id })
                .exec((error, totalPages) => {
                    if (!error) {
                        if (err) {
                            return res.status(400).json({
                                error: 'players not found'
                            });
                        }
                        res.json({
                            totalPages: Math.ceil(totalPages/limit),
                            page,
                            result: players
                        });
                    }
                });
    });
};
