var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config = require('./config');
var debug = config.DEBUG;

var app = express();
var router = express.Router()

/** Mongoose init **/
mongoose.connect(config.mongoURI[app.settings.env], { useMongoClient: true });
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + config.mongoURI[app.settings.env]);
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose connection error: ' + error);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected.');
});

/** Middleware **/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var reqCatch = require('./middleware/reqCatch');
app.use(reqCatch);
var setHeaders = require('./middleware/setHeaders');
app.use(setHeaders);

require('./routes/user')(router, debug);
require('./routes/match')(router, debug);
require('./routes/feed')(router, debug);
/** Add router endpoints to app **/
app.use('/', router);
/** Spin app **/
app.listen(config.PORT, function() {
	console.log('Bandmate Api listening on port: ' + config.PORT);
});

module.exports = app;
