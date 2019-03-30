const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const Route = mongoose.model('Route');
const Listing = mongoose.model('Listing');
const ListingMember = mongoose.model('ListingMember');
const jwtCheck = require('../auth');
const Http = require('../../agent.js');
const keys = require('../../env-config.js');
const axios = require('axios');



const headers = (token) => {
	return { headers: { 'Authorization' : 'Bearer ' + token }};
}

//retreive listings/rides
router.get('/listings', async (req, res, next) => {
	try {
		await Listing.find({})
		.populate('route')
		.populate('members')
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
router.post('/lead/addMember', jwtCheck, async (req, res) => {
	try {

		let listingMember = new ListingMember();

		listingMember.firstname = req.body.firstname;
		listingMember.lastname = req.body.lastname;
		listingMember.profile_photo = req.body.profile_photo;
		listingMember.location = req.body.location;
		listingMember.listing_id = req.body.listing_id;
		listingMember.user_id = req.body.user_id;
		
		await listingMember.save();
		
		await Listing.findById(req.body.listing_id)
			.exec(function (err, listing) {
				if (err) return console.log(err);
				listing.members.push(listingMember._id);
				listing.save();

				res.send(listingMember);
			});

		//find listing with req.body.listing_id
		//update listing groupMembersList array with listingMember
		//save listing

		// let listingObject = listingMember.toObject();

		// res.json({
		// 	listing: listingObject
		// });
	}
	catch(err) {
		console.log(err);
		res.json(500, {error: err});

	}
}).req;

router.delete('/listing/remove/:id', jwtCheck, async (req, res) => {
	try {
		Listing
			.deleteOne({_id: req.params.id}, function(err, listing) {
				res.send(listing);
			})
	}
	catch(e) {
		console.log(e);
	}
})

//post new ride listing
router.post('/lead', jwtCheck, async (req, res) => {
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
		listing.creator = req.body.creator;
		listing.creator_id = req.body.creator_id;
		listing.creator_photo = req.body.creator_photo;

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
		
		await listing.save();

		let listingObject = listing.toObject();
		
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