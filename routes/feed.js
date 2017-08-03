var Match = require('../models/match');
var User = require('../models/user');

module.exports = function(router, debug){
	router.route('/feed/:uid')
	.get(function(req, res) {
		var usersFeed = [];
		User.findById(req.params.uid, function(err, usr) {
			if(err) {
				res.sendStatus(500);
			} else {
				User.find({ 'meta.city': usr.meta.city, _id: { '$ne': usr._id }},
				function(error, usrs) {
					if(error) {
						res.sendStatus(500);
					} else {
						var idx = 0;
						while (idx < usrs.length) {
							var newMatch = new Match({
								userID: usr._id,
								targetID: usrs[idx]._id
							});
							newMatch.save(function(error_, mtch) {
								usersFeed.push(mtch);
								if (idx === (usrs.length)) {
									res.json(usersFeed);
								};
							});
							idx = idx + 1;
						};
					};
				});
			};
		});
	});
};
