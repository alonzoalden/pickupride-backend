const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const Auth = require('../auth');
const Http = require('../../agent.js');
const keys = require('../../env-config.js');
const _ = require('underscore');

//retrieve user info
router.get('/user/:authAccessToken', Auth, async (req, res, next) => {
	try {
		const response = await Http
			.setToken(req.params.authAccessToken)
			.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`);
		await User
			.findOne({ 'auth_email': response.email }, (err, person) => {
				if (err) return console.log(err);
				return res.json({user: person});
			});
	}
	catch(e) {
		console.log(e);
	}
});

//retreive routes for leads
router.get('/user/routes/:id', Auth, async (req, res, next) => {
	try {
		await User.findById(req.params.id, async (err, person) => {
			if (err) return console.log(err);
			const routesResponse = await Http
				.setToken(person.access_token)
				.requests.get(`https://www.strava.com/api/v3/athletes/${person.strava_id}/routes`);
			res.json({routes: routesResponse});
		});
	}
	catch(e) {
		console.log(e);
	}
});

//return auth email
router.get('/user/authEmail/:authAccessToken', async (req, res, next) => {
	try {
		const user = {
			firstname: '',
			auth_email: ''
		};
		const authResponse = await http
			.setToken(req.params.authAccessToken)
			.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`)
	}
	catch(e) {
		console.log(e);
	}
});

//register new user
router.post('/user/register', async (req, res) => {
	try {
		const userInfo = {
			client_id: keys.STRAVA_CLIENT_ID,
			client_secret: keys.STRAVA_CLIENT_SECRET,
			code: req.body.code,
		};

		const stravaResponse = await http
			.requests.post('https://www.strava.com/oauth/token', userInfo)
		
		const authResponse	= await http
			.setToken(req.body.accessToken)
			.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`)
		
		if (!stravaResponse.athlete.email) {
			const tempUserInfo = {
				firstname: authResponse.email
			};
			return res.json({user: tempUserInfo});
		}

		let user = new User();
		user.access_token = stravaResponse.access_token;
		user.strava_email = stravaResponse.athlete.email;
		user.auth_email = authResponse.email;
		user.strava_id = stravaResponse.athlete.id;
		user.firstname = stravaResponse.athlete.firstname;
		user.lastname = stravaResponse.athlete.lastname;
		user.profile_medium = stravaResponse.athlete.profile_medium;
		user.profile = stravaResponse.athlete.profile;
		user.city = stravaResponse.athlete.city;
		user.state = stravaResponse.athlete.state;
		user.country = stravaResponse.athlete.country;
		user.sex = stravaResponse.athlete.sex;
		user.created_at = stravaResponse.athlete.created_at;
		user.updated_at = stravaResponse.athlete.updated_at;

		await user.save()
		delete user.access_token;
		res.json({user: user.toObject()});
	}
	catch(e) {
		console.log(e);
	}
});

module.exports = router;