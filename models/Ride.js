var mongoose = require('mongoose');

var RideSchema = new mongoose.Schema({
	title: {type: String, required: [true, "can't be blank"]},
	pace: {type: String, required: [true, "can't be blank"]},
	date: {type: String, required: [true, "can't be blank"]},
	time: {type: String, required: [true, "can't be blank"]},
    info: String,
    route_id: {type: Number, required: [true, "can't be blank"]},
}, {timestamps: true});

mongoose.model('User', RideSchema);
