process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../app');
var Match = require('../models/match');

var should = chai.should();
chai.use(chaiHttp);

describe('Matches', function() {
	Match.collection.drop();
	beforeEach(function(done){
		var newMatch = new Match({
			userID: 'bob',
			targetID: 'jane'
		});
		newMatch.save(function(err) {
			done();
		});
	});
	afterEach(function(done){
		Match.collection.drop();
		done();
	});

	it('should list ALL Matches on /matches GET', function(done) {
		chai.request(server)
			.get('/matches')
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('userID');
				res.body[0].should.have.property('targetID');
				res.body[0].userID.should.equal('bob');
				res.body[0].targetID.should.equal('jane');
				done();
			});
	});
	it('should list a SINGLE Match on /match/<id> GET', function(done) {
		var newMatch = new Match({
			userID: 'jill',
			targetID: 'john'
		});
		newMatch.save(function(err, mtch) {
			chai.request(server)
				.get('/match/' + mtch.id)
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					res.body.should.have.property('userID');
					res.body.should.have.property('targetID');
					res.body._id.should.equal(mtch.id);
					res.body.userID.should.equal('jill');
					res.body.targetID.should.equal('john');
					done();
				});
		});
	});
	it('should add a SINGLE Match on /matches POST', function(done) {
		chai.request(server)
			.post('/matches')
			.send({ userID: 'jack', targetID: 'laura' })
			.end(function(err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('SUCCESS');
				res.body.SUCCESS.should.be.a('object');
				res.body.SUCCESS.should.have.property('userID');
				res.body.SUCCESS.should.have.property('targetID');
				res.body.SUCCESS.userID.should.equal('jack');
				res.body.SUCCESS.targetID.should.equal('laura');
				done();
			});
	});
	it('should updated a SINGLE Match on /match/<id> PUT', function(done) {
		chai.request(server)
			.get('/matches')
			.end(function(err, res) {
				chai.request(server)
					.put('/match/' + res.body[0]._id)
					.send({ liked: true })
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('UPDATED');
						response.body.UPDATED.should.have.property('liked');
						response.body.UPDATED.liked.should.equal(true);
						done();
					});
			});
	});
	it('should delete a SINGLE Match on /match/<id> DELETE', function(done) {
		chai.request(server)
			.get('/matches')
			.end(function(err, res) {
				chai.request(server)
					.delete('/match/' + res.body[0]._id)
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('REMOVED');
						response.body.REMOVED.should.have.property('userID');
						response.body.REMOVED.should.have.property('targetID');
						response.body.REMOVED.should.have.property('_id');
						response.body.REMOVED.userID.should.equal('bob');
						done();
					});
			});
	});
	it('should return if users are a MATCH on /is-match POST', function(done) {
		var newMatch = new Match({
			userID: 'jane',
			targetID: 'bob'
		});
		newMatch.liked = true;
		newMatch.save(function(err, mtch) {
			chai.request(server)
				.get('/matches')
				.end(function(error, res){
					chai.request(server)
						.put('/match/' + res.body[0]._id)
						.send({ liked: true })
						.end(function(_error, _response) {
							chai.request(server)
								.post('/is-match')
								.send({ usr1: 'bob', usr2: 'jane' })
								.end(function(_error_, _response_) {
									_response_.should.have.status(200);
									_response_.should.be.json;
									_response_.body.should.be.a('object');
									_response_.body.should.have.property('MATCH');
									_response_.body.MATCH.should.equal(true);
									done();
								});
						});
				})
		});
	});
	it('should return all MATCHES where user has been liked /liked/<uid>',
	function(done) {
		var newMatch = new Match({
			userID: 'jane',
			targetID: 'bob'
		});
		newMatch.liked = true;
		newMatch.save(function(err, mtch) {
			chai.request(server)
				.get('/liked/bob')
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.be.a('array');
					response.body[0].should.be.a('object');
					response.body[0].should.have.property('userID');
					response.body[0].should.have.property('targetID');
					response.body[0].should.have.property('liked');
					response.body[0].userID.should.equal('jane');
					response.body[0].targetID.should.equal('bob');
					response.body[0].liked.should.equal(true);
					done();
				});
		});
	});
});
