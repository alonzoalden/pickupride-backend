var mongoose = require('mongoose');

var ListingMemberSchema = new mongoose.Schema({
    firstname: String,
	lastname: String,
    profile_photo: String,
    state: String,
    // listing_id: {type: String, required: [true, "can't be blank"]},
    // user_id: {type: String, required: [true, "can't be blank"]},
}, {timestamps: true});

mongoose.model('ListingMember', ListingMemberSchema);