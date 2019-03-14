const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const Route = mongoose.model('Route');
const Listing = mongoose.model('Listing');
const Auth = require('../auth');
const Http = require('../../agent.js');
const keys = require('../../env-config.js');
const axios = require('axios');


const headers = (token) => {
	return { headers: { 'Authorization' : 'Bearer ' + token }};
}

//retreive listings/rides
router.get('/listings', Auth, async (req, res, next) => {
	try {
		await Listing.find({})
		.populate('route')
		.exec(function (err, listings) {
			if (err) return console.log(err);
			res.send(listings);
		});
	}
	catch(e) {
		console.log(e);
	}
});

//post new ride listing
router.post('/lead', async (req, res) => {
	try {

		let listing = new Listing();
		let route = new Route();

		listing.type = req.body.type;
		listing.title = req.body.title;
		listing.pace = req.body.pace;
		listing.date = req.body.date;
		listing.time = req.body.time;
		listing.info = req.body.info;
		listing.route_id = req.body.route.id;

		route.id = req.body.route.id;
		route.athlete = req.body.route.athlete;
		route.created_at = req.body.route.created_at;
		route.description = req.body.route.description;
		route.distance = req.body.route.distance;
		route.elevation_gain = req.body.route.elevation_gain;
		route.estimated_moving_time = req.body.route.estimated_moving_time;
		route.map =  req.body.route.map;
		route.name = req.body.route.name;
		route.private = req.body.route.private;
		route.resource_state = req.body.route.resource_state;
		route.starred = req.body.route.starred;
		route.sub_type = req.body.route.sub_type;
		route.timestamp = req.body.route.timestamp;
		route.type = req.body.route.type;
		route.updated_at = req.body.route.updated_at;

		await route.save();
		listing.route = route._id;
		console.log(route, listing)
		await listing.save();

		let listingObject = listing.toObject();
		listingObject.route = route.id;
		res.json({
			listing: listingObject
		});
	}
	catch(err) {
		console.log(err);
		res.json(500, {error: err});

	}
}).req;

module.exports = router;