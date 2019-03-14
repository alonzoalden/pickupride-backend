var mongoose = require('mongoose');

var ListingSchema = new mongoose.Schema({
    type: {type: String, required: [true, "can't be blank"]},
	title: {type: String, required: [true, "can't be blank"]},
	pace: {type: String, required: [true, "can't be blank"]},
	date: {type: String, required: [true, "can't be blank"]},
	time: {type: String, required: [true, "can't be blank"]},
    info: String,
	// route_id: {type: Number, required: [true, "can't be blank"]},
	route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'}
}, {timestamps: true});

mongoose.model('Listing', ListingSchema);
