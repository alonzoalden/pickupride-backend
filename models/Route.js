var mongoose = require('mongoose');

var RouteSchema = new mongoose.Schema({
    id: {type: Number, required: [true, "can't be blank"]},
	athlete: {type: Object, required: [true, "can't be blank"]},
	created_at: {type: String, required: [true, "can't be blank"]},
	time: String,
    info: String,
    created_at: String,
    description: String,
    distance: Number,
    elevation_gain: Number,
    estimated_moving_time: Number,
    map: {type: Object, required: [true, "can't be blank"]},
    name: String,
    private: Boolean,
    resource_state: Number,
    starred: Boolean,
    sub_type: Number,
    timestamp: Number,
    type: Number,
    updated_at: String,
}, {timestamps: true});

mongoose.model('Route', RouteSchema);
