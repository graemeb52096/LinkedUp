var User = require('../models/user');

module.exports = function(router, debug) {
	router.route('/users')
	.get(function(req, res) {
		User.find(function(err, users) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
					return;
				};
			} else {
				res.json(users);
			};
		});
	})
	.post(function(req, res) {
		var data = {
			email: req.body.email,
			password: req.body.password,
		};
		var user = new User(data);
		user.save(function(err) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
					return;
				};
			} else {
				res.status(201).json({ 'SUCCESS': user });
			};
		});
	});

	router.route('/user/:uid')
	.get(function(req, res) {
		User.findById(req.params.uid, function(err, usr) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
					return;
				};
			} else {
				res.json(usr);
			};
		});
	})
	.put(function(req, res) {
		User.findById(req.params.uid, function(err, usr) {
			usr.email = req.body.email;
			usr.password = req.body.password;
			usr.skills = req.body.skills;
			usr.interests = req.body.interests;
			usr.save(function(err) {
				if(err) {
					if(debug) {
						res.status(500).json(err);
					} else {
						res.sendStatus(500);
					};
				} else {
					res.json({ 'UPDATED': usr });
				}
			});
		});
	})
	.delete(function(req, res) {
		User.findByIdAndRemove(req.params.uid, function(err, usr) {
			if(err) {
				if(debug) {
					res.json(err);
				} else {
					res.sendStatus(500);
					return;
				};
			} else if(!usr) {
				res.sendStatus(404);
				return;
			} else {
				res.status(200).json({ 'REMOVED': usr });
			};
		});
	});

	router.route('/ugs/:skill')
	.get(function(req, res) {
		User.find({ 'skills.skill': req.params.skill  }, function(err, users) {
			if(err) {
				if(debug) {
					res.status(500).json(err);
				} else {
					res.sendStatus(500);
				};
			} else {
				res.json(users);
			};
		});
	});
};
