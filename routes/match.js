var Match = require('../models/match');

module.exports = function(router, debug) {
	router.route('/matches')
	.get(function(req, res) {
		Match.find(function(err, matches) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
					return;
				};
			} else {
				res.json(matches);
			};
		});
	})
	.post(function(req, res) {
		var data = {
			userID: req.body.userID,
			targetID: req.body.targetID
		};
		var match = new Match(data);
		match.save(function(err) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
				};
			} else {
				res.status(201).json({ 'SUCCESS': match });
			};
		});
	});

	router.route('/match/:mid')
	.get(function(req, res) {
		Match.findById(req.params.mid, function(err, match) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
				};
			} else {
				res.json(match);
			};
		});
	})
	.put(function(req, res) {
		Match.findById(req.params.mid, function(err, match) {
			match.liked = req.body.liked;
			match.save(function(err) {
				if(err) {
					if(debug) {
						res.status(500).json(err);
					} else {
						res.sendStatus(500);
					};
				} else {
					res.json({ 'UPDATED': match });
				};
			});
		});
	})
	.delete(function(req, res) {
		Match.findByIdAndRemove(req.params.mid, function(err, match) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
				};
			} else {
				res.json({ 'REMOVED': match });
			};
		});
	});

	router.route('/is-match')
	.post(function(req, res) {
		var usr1 = req.body.usr1;
		var usr2 = req.body.usr2;
		Match.findOne({ userID: usr1, targetID: usr2 },
			function(err, match) {
				if(err) {
					if(debug) {
						res.status(500).json(err);
					} else {
						res.sendStatus(500);
					};
				} else {
					var usr1t2 = match.liked;
					Match.findOne({ userID: usr2, targetID: usr1 },
						function(error, mtch) {
							if(error) {
								if(debug) {
									res.status(500).json(err);
								} else {
									res.sendStatus(500);
								};
							} else {
								var usr2t1 = mtch.liked;
								if(usr1t2 && usr2t1) {
									res.json({ 'MATCH': true });
								} else {
									res.json({ 'MATCH': false });
								};
							};
						});
				};
			});
	});

	router.route('/liked/:uid')
	.get(function(req, res) {
		Match.find({ targetID: req.params.uid, liked: true }, function(err, matches) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
				};
			} else {
				res.json(matches);
			};
		});
	});
};
