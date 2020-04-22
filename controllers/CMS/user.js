const User = require('../../models/CMS/users');
const { errorHandler } = require('../../helpers/dbErrorHandler');

const jwt = require('jsonwebtoken'); //to generate token for sign in
const expressJwt = require('express-jwt'); //for authorization

exports.signup = (req, res) => {
	const user = new User(req.body);
	console.log(req.body);
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: errorHandler(err),
			});
		}
		user.salt = undefined;
		user.hashPassword = undefined;
		res.json({
			user,
		});
	});
};

exports.signin = (req, res) => {
	//find user with email
	const { username, password } = req.body;
	User.findOne({ username }, (err, user) => {
		console.log(err, user);
		if (err || !user) {
			return res.status(400).json({
				err: 'User does not exist... Please signup',
			});
		}
		//if user then check password
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: 'Invalid credentials',
			});
		}
		//if matches then generate signed token with user id and secret
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		//persist the token as 't' in cookie with expiry date
		res.cookie('t', token, { expire: new Date() + 9999 });
		//send response with user and token
		const { _id, username, firstname, lastname, email, role } = user;
		return res.json({ token, user: { _id, username, firstname, lastname, email, role } });
	});
};

exports.logout = (req, res) => {
	res.clearCookie('t');
	res.json({ message: 'Logout success' });
};

exports.requiredSignIn = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'auth',
});

//for user profile
exports.userById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			res.status(400).json({
				error: 'No user found',
			});
		}
		req.profile = user;
		next();
	});
};

//authenticated user or not
exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(400).json({
			error: 'Access Denied',
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'Access Denied',
		});
	}
	next();
};

//to show user the profile information
exports.read = (req, res) => {
	req.profile.hashPassword = undefined;
	req.profile.salt = undefined;

	return res.json(req.profile);
};

//update profile information
exports.update = (req, res) => {
	User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
		if (err) {
			return res.status(400).json({
				error: 'Access denied',
			});
		}
		user.hashPassword = undefined;
		user.salt = undefined;

		return res.json(user);
	});
};
