var mongoose = require('mongoose');

var ListingSchema = new mongoose.Schema({
    type: {type: String, required: [true, "can't be blank"]},
	title: {type: String, required: [true, "can't be blank"]},
	pace: {type: String, required: [true, "can't be blank"]},
	date: {type: String, required: [true, "can't be blank"]},
	time: {type: String, required: [true, "can't be blank"]},
    info: String,
	route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: [true, "can't be blank"]},
	creator: {type: String, required: [true, "can't be blank"]},
	creator_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: [true, "can't be blank"]},
	creator_photo: {type: String, required: [true, "can't be blank"]},
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps: true});

mongoose.model('Listing', ListingSchema);
