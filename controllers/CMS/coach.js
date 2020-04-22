const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Coach = require('../../models/CMS/coaches');
const { errorHandler } = require('../../helpers/dbErrorHandler');

exports.coachById = (req, res, next, id) => {
    Coach.findById(id)
        .populate('team', '_id name')
        .exec((err, coach) => {
        if (err || !coach) {
            return res.status(400).json({
                error: "Coach not found"
            });
        }
        req.coach = coach;
        next();
    })
}

exports.getCoach = (req, res) => {
    req.coach.photo = undefined;
    return res.json(req.coach);
}

exports.addCoach = (req, res) => {
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
            email
        } = fields

        if (!firstname ||
            !lastname ||
            !role ||
            !age || 
            !email ) {
                return res.status(400).json({
                    error: "All fields are required"
                })
        }

        let coach = new Coach(fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB"
                })
            }
            coach.photo.data = fs.readFileSync(files.photo.path)
            coach.photo.contentType = files.photo.type
        }

        coach.save((err, result) => {
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

exports.getCoaches = (req, res) => {
    const order = req.query.orderBy ? req.query.orderBy : 'asc';
    const sort = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1)*limit
    Coach.find({ user: req.profile._id })
        .select('-photo')
        .sort([[ sort, order ]])
        .populate('team', '_id name')
        .limit(limit)
        .skip(skip)
        .exec((err, coaches) => {
            Coach.countDocuments({ user: req.profile._id })
                .exec((error, totalPages) => {
                    if(!error) {
                        if (err) {
                            res.status(400).json({
                                error: 'coaches not found'
                            });
                        }
                        res.json({
                            totalPages: Math.ceil(totalPages/limit),
                            page,
                            result: coaches
                        });
                    }
                });
    });
};

exports.deleteCoach = (req, res) => {
    let coach = req.coach;
    coach.remove(err => {
        if (err) {
            res.status(400).json({
                error: 'coach not found'
            });
        }
        res.json({
            message: 'coach deleted'
        })
    });
};

exports.updateCoach = (req, res) => {
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
            email
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email) {
                return res.status(400).json({
                    error: "All fields are required"
                })
        }

        let coach = req.coach
        coach = _.extend(coach, fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB"
                })
            }
            coach.photo.data = fs.readFileSync(files.photo.path)
            coach.photo.contentType = files.photo.type
        }

        coach.save((err, result) => {
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
    status = req.coach.isActive
    Coach.findOneAndUpdate(
        { _id: req.coach._id },
        { isActive: !status },
        { new: true }
    )
    .populate('team', '_id name')
    .exec((err, coach) => {
        if (err) {
            return res.status(400).json({
                error: 'coach not found'
            });
        }
        coach.photo = undefined;
        res.json(coach)
    });
};

exports.getAllCoaches = (req, res) => {
    Coach.find({ user: req.profile._id, isActive: true })
        .select('_id firstname')
        .exec((err, coaches) => {
            if (err) {
                return res.status(400).json({
                    error: 'no available coaches'
                });
            }
            return res.json(coaches)
        });
}
