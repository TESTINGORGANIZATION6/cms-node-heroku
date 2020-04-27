const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Player = require('../../models/CMS/players');
const { errorHandler } = require('../../helpers/dbErrorHandler');
const Team = require('../../models/CMS/teams');

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
                    if(result.team) {
                        const addPlayer = {
                            firstname: result.firstname,
                            lastname: result.lastname,
                            age: result.age,
                            _id: result._id
                        }
                
                        Team.findOneAndUpdate(
                            { _id: result.team },
                            { $push: { "players": addPlayer }},
                            { new: true }
                        ).exec((err, team) => {
                            if(err) {
                                console.log(err)
                                return res.status(400).json({
                                    error: 'Invalid team'
                                })
                            } 
                            console.log(team)
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
    // Validate the fields
    const {
        firstname,
        lastname,
        role,
        age,
        email,
        position
    } = req.fields

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
    player = _.extend(player, req.fields)

    const files = req.files
    if (files.photo) {
        if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: "Image should be less than 1MB"
            })
        }
        player.photo.data = fs.readFileSync(files.photo.path)
        player.photo.contentType = files.photo.type
    }

    if(req.teamId) {
        player.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            } 
            Player.findOneAndUpdate(
                { _id: req.player._id },
                { team: req.teamId },
                { new: true }
            )
            .exec((err, player) => {
                if (err) {
                    return res.status(400).json({
                        error: 'player not found'
                    });
                } 
                player.populate('team', '_id name')
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
    } else {
        player.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            Player.findOneAndUpdate(
                { _id: result._id },
                { $unset: { team: 1 }},
                { new: true }
            ).exec((err, updatedPlayer) => {
                if(err) {
                    return res.status(400).json({
                        error: 'player not found'
                    });
                }
                res.json(updatedPlayer)
            });
        });
    }
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
    console.log(page, limit)
    Player.find({ 
            user: req.profile._id,
            team: null,
            age: { $gt: minAge, $lt: maxAge },
            isActive: true
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

exports.updatePlayerinTeam = (req, res, next) => {
    if(req.teamId) {
        // If currentId and player team Id is same then no action
        console.log(req.teamId, req.player.team)
        if (req.player.team) {
            if(req.teamId == req.player.team._id) {
                next()
            }
        } else {
            const addPlayer = {
                firstname: req.player.firstname,
                lastname: req.player.lastname,
                age: req.player.age,
                _id: req.player._id,
                role: req.player.role,
                email: req.player.email,
                position: req.player.position
            }

            Team.findOneAndUpdate(
                { _id: req.teamId },
                { $push: { "players": addPlayer }},
                { new: true }
            ).exec((err, team) => {
                if(err) {
                    return res.status(400).json({
                        error: 'Invalid team'
                    })
                }
                next()
            })
        }
    } else {
        // If updated team is null, then first pull out the players team and remove the player
        if(!req.player.team) {
            next()
        } else {
            Player.findOne({ _id: req.player._id })
                .exec((err, player) => {
                    if(err) {
                        return res.json({
                            error: "player not found"
                        })
                    }
                    const teamId = player.team
                    Team.findByIdAndUpdate(
                        { _id: teamId },
                        { $pull: { players: { _id: req.player._id }}},
                        { new: true }
                    ).exec((err, team) => {
                        if(err) {
                            return res.status(400).json({
                                error: 'Invalid team'
                            })
                        }
                        next()
                    })
                })
            }
    }
};

exports.getTeamParam = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        const { team } = fields;
        req.teamId = team;
        req.fields = fields;
        req.files = files;
        next();
    });
};
