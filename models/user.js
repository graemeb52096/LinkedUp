var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: { type: String, required: true, index:{ unique:true } },
	password: { type: String, required: true },
	firstName: String,
	lastName: String,
	skills: [{ skill: String, years: Number }],
	interests: [ String ],
	bio: String,
	meta: {
		joined: { type: Date, default: Date.now },
		city: String,
		dob: Date,
		long: Number,
		lat: Number
	}
});

userSchema.methods.validPassword = function(pass) {
	if (this.password === pass) {
		return true;
	};
	return false;
};

User = mongoose.model('User', userSchema);

module.exports = User;
