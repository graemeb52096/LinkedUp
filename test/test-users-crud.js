process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../app');
var User = require('../models/user');

var should = chai.should();
chai.use(chaiHttp);

/** Tests for Users CRUD Api **/
describe('Users', function() {
  User.collection.drop();
  beforeEach(function(done){
    var newUser = new User({
      email: 'test@mocha.com',
      password: 'secret'
    });
    newUser.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
    User.collection.drop();
    done();
  });

  it('should list ALL Users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('email');
        res.body[0].should.have.property('password');
        res.body[0].email.should.equal('test@mocha.com');
        res.body[0].password.should.equal('secret');
        done();
      });
  });
  it('should list a SINGLE user on /user/<id> GET', function(done) {
    var newUser = new User({
      email: 'tst@mocha.com',
      password: 'secret'
    });
    newUser.save(function(err, usr) {
      chai.request(server)
        .get('/user/' + usr.id)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          res.body.email.should.equal('tst@mocha.com');
          res.body.password.should.equal('secret');
          res.body._id.should.equal(usr.id);
          done();
        });
    });
  });
  it('should add a SINGLE user on /users POST', function(done) {
    chai.request(server)
      .post('/users')
      .send({ 'email': 'tst@mocha.com', 'password': 'secret' })
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('email');
        res.body.SUCCESS.should.have.property('password');
        res.body.SUCCESS.email.should.equal('tst@mocha.com');
        res.body.SUCCESS.password.should.equal('secret');
        done();
      });
  });
  it('should update a SINGLE user on /user/<id> PUT', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res) {
        chai.request(server)
          .put('/user/' + res.body[0]._id)
          .send({
            'email': res.body[0].email,
            'password': res.body[0].password,
            'skills': res.body[0].skills,
            'interests': [ 'rock' ]
          })
          .end(function(error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('UPDATED');
            response.body.UPDATED.should.be.a('object');
            response.body.UPDATED.should.have.property('email');
            response.body.UPDATED.should.have.property('password');
            response.body.UPDATED.should.have.property('interests');
            response.body.UPDATED.should.have.property('_id');
            response.body.UPDATED.interests.should.be.a('array');
            response.body.UPDATED.interests[0].should.equal('rock');
            done();
          });
      });
  });
  it('should delete a SINGLE user on /user/<id> DELETE', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res) {
        chai.request(server)
          .delete('/user/' + res.body[0]._id)
          .end(function(error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('REMOVED');
            response.body.REMOVED.should.be.a('object');
            response.body.REMOVED.should.have.property('email');
            response.body.REMOVED.should.have.property('password');
            response.body.REMOVED.should.have.property('skills');
            response.body.REMOVED.should.have.property('interests');
            response.body.REMOVED.should.have.property('_id');
            response.body.REMOVED.email.should.equal('test@mocha.com');
            done();
          });
      });
  });
  it('should get all USERS with skill on /ugs/<skill> GET',
    function(done) {
      var newUser = new User({
        email: 'tst@mocha.com',
        password: 'secret',
        skills: { skill: 'drums', years: 5 }
      });
      newUser.save(function(err, usr) {
        chai.request(server)
          .get('/ugs/drums')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('email');
            res.body[0].should.have.property('skills');
            res.body[0].skills.should.be.a('array');
            res.body[0].skills[0].should.be.a('object');
            res.body[0].skills[0].should.have.property('skill');
            res.body[0].skills[0].should.have.property('years');
            res.body[0].email.should.equal('tst@mocha.com');
            res.body[0].skills[0].skill.should.equal('drums');
            res.body[0].skills[0].years.should.equal(5);
            done();
          });
      });
    });
});
