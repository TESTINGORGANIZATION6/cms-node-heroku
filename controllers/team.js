const { errorHandler } = require('../helpers/dbErrorHandler');
const Team = require('../models/teams');

exports.addTeam = (req, res) => {
    const team = new Team(req.body);
    console.log(req.body)
    team.save((err, team) => {
        if (err) {
			return res.status(400).json({
				err: errorHandler(err),
			});
        }
        res.json({
            team
        })
    });
};

exports.teamById = (req, res, next, id) => {
	Team.findById(id).exec((err, team) => {
		if (err || !team) {
			res.status(400).json({
				error: 'No team found',
			});
		}
		req.team = team;
		next();
	});
};

exports.getTeam = (req, res) => {
    return res.json(req.team);
}
