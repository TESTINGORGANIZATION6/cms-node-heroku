const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Coach = require('../models/coaches');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.coachById = (req, res, next, id) => {
    Coach.findById(id).exec((err, coach) => {
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
            email,
            team
        } = fields

        if (!firstname ||
            !lastname ||
            !role ||
            !age || 
            !email || 
            !team ) {
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
                return re.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};

exports.getCoaches = (req, res) => {
    Coach.find().exec((err, coaches) => {
        if (err) {
            res.status(400).json({
                error: 'coaches not found'
            });
        }
        res.json(coaches)
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
            email,
            team
        } = fields

        if (!firstname ||
            !lastname ||
            !role || 
            !age || 
            !email || 
            !team) {
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
                return re.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};

exports.updateStatus = (req, res) => {
    status = req.coach.isActive
    Coach.findOneAndUpdate(
        { _id: req.coach._id },
        { isActive: !status },
        { new: true }
    ).exec((err, coach) => {
        if (err) {
            return res.status(400).json({
                error: 'coach not found'
            });
        }
        coach.photo = undefined;
        res.json(coach)
    });
};
