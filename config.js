var config = {
	DEBUG: true,
	PORT: 3000
};

config.mongoURI = {
	development: 'mongodb://localhost:27017/bandmate',
	test: 'mongodb://localhost:27017/test-bandmate'
};

module.exports = config;
