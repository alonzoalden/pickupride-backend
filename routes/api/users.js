var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var axios = require('axios');
var http = require('../../agent.js');
var keys = require('../../env-config.js');
const _ = require('underscore');
const polyline = require('polyline');
 
// returns an array of lat, lon pairs 
// polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
 
// // returns a string-encoded polyline 
//polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);
 

//retrieve user info
router.get('/user/:authAccessToken', auth, function(req, res, next){
	http.setToken(req.params.authAccessToken);
	http.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`)
		.then((response) => {
			User.findOne({ 'auth_email': response.email }, function (err, person) {
				if (err) return console.log(err);
				return res.json({user: person});
			});
  		});
});

//retreive routes for leads
router.get('/user/routes/:id', auth, function(req, res, next) {

	User.findById(req.params.id, function (err, person) {
		if (err) return console.log(err);
		http.setToken(person.access_token);
 		http.requests.get(`https://www.strava.com/api/v3/athletes/${person.strava_id}/routes`)
		 	.then((routesResponse) => {
				// routesResponse.forEach(function(route){
				// 	route.map.polyline = polyline.decode(route.map.summary_polyline);
				// });

				res.json({routes: routesResponse});
			});
  	});
});

//register new user
router.post('/user/register', function(req, res, next) {

	const userInfo = {
		client_id: keys.STRAVA_CLIENT_ID,
		client_secret: keys.STRAVA_CLIENT_SECRET,
		code: req.body.code,
	};

	http.requests.post('https://www.strava.com/oauth/token', userInfo)
		.then((stravaResponse)=> {
			if (!!stravaResponse.athlete.email) {
				const tempUserInfo = {
					firstname: authResponse.email
				}
				return res.json({user: tempUserInfo});
			}

			http.setToken(req.body.accessToken);
			http.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`)
				.then((authResponse) => {
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

					user.save()
						.then(() => {
							delete user.access_token;
							res.json({user: user.toObject()});
                    	})
                    .catch(next);
				});

		})
		.catch((error)=> {
			console.log(error);
		});

});


module.exports = router;