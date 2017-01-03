var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var properties = require('../lib/envProperties');

module.exports = {
	db: properties.MONGO_DOMAIN,
    rootPath: rootPath
};