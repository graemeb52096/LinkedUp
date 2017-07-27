var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
	userID: { type: String, required: true },
	targetID: { type: String, required: true },
	liked: Boolean
});

Match = mongoose.model('Match', matchSchema);

module.exports = Match;
