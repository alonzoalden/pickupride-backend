const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const Route = mongoose.model('Route');
const Ride = mongoose.model('Ride');
const Auth = require('../auth');
const Http = require('../../agent.js');
const keys = require('../../env-config.js');
const axios = require('axios');


const headers = (token) => {
	return { headers: { 'Authorization' : 'Bearer ' + token }};
}

//post new ride listing
router.post('/lead', async (req, res) => {
	try {

		let ride = new Ride();
		let route = new Route();

		ride.type = req.body.type;
		ride.title = req.body.title;
		ride.pace = req.body.pace;
		ride.date = req.body.date;
		ride.time = req.body.time;
		ride.info = req.body.info;
		ride.route_id = req.body.route.route_id
		
		route.athlete = req.body.route.athlete;
		route.created_at = req.body.route.created_at
		route.description = req.body.route.description
		route.distance = req.body.route.distance
		route.elevation_gain = req.body.route.elevation_gain
		route.estimated_moving_time = req.body.route.estimated_moving_time
		route.id = req.body.route.estimated_moving_time;
		route.map =  req.body.route.map;
		route.name = req.body.route.name;
		route.private = req.body.route.private;
		route.resource_state = req.body.route.resource_state;
		route.starred = req.body.route.starred;
		route.sub_type = req.body.route.sub_type;
		route.timestamp = req.body.route.timestamp;
		route.type = req.body.route.type;
		route.updated_at = req.body.route.updated_at;
		
		await ride.save()
		await route.save()

		res.json({user: user.toObject()});
	}
	catch(e) {
		console.log(e);
		res.json(500, {error: e});
	}
});

module.exports = router;