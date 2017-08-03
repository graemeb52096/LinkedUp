process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../app');
var User = require('../models/user');
var Match = require('../models/match');

var should = chai.should();
chai.use(chaiHttp);

var targetUsr;

describe('Feed', function() {
	User.collection.drop();
	Match.collection.drop();
	beforeEach(function(done){
		var newUser = new User({
			email: 'tst@mocha.com',
			password: 'secret',
			meta: { city: 'bay area' }
		});
		newUser.save(function(err, usr) {
			targetUsr = usr;
			done();
		});
	});
	afterEach(function(done){
		User.collection.drop();
		Match.collection.drop();
		done();
	});
	it('should return MATCHES for all users in same city on /feed/<uid> GET',
	function(done) {
		var newUser = new User({
			email: 'bob@guitar.com',
			password: 'pass',
			meta: { city: 'bay area' }
		});
		newUser.save(function(err, usr) {
			chai.request(server)
				.get('/feed/' + usr._id)
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body[0].should.be.a('object');
					res.body[0].should.have.property('userID');
					res.body[0].should.have.property('targetID');
					chai.request(server)
						.get('/user/' + res.body[0].targetID)
						.end(function(error, response) {
							response.should.have.status(200);
							response.should.be.json;
							response.body.should.be.a('object');
							response.body.should.have.property('email');
							response.body.email.should.equal('tst@mocha.com');
							chai.request(server)
								.get('/user/' + res.body[0].userID)
								.end(function(error_, response_) {
									response_.should.have.status(200);
									response_.should.be.json;
									response_.body.should.be.a('object');
									response_.body.should.have.property('email');
									response_.body.email.should.equal('bob@guitar.com');
									done();
								});
						});
				});
		});
	});
});
