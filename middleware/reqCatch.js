var config = require('../config');

module.exports = function(req, res, next) {
  if(config.DEBUG){
    console.log(req.method + ' request was made at: ' + req.originalUrl);
  };
  next();
};
