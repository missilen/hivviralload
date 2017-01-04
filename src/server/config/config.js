var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var openmrsPath = "http://localhost:8081/openmrs-standalone/";
var properties = require('../lib/envProperties');

module.exports = {
	db: properties.MONGO_DOMAIN,
    rootPath: rootPath,
    openmrsPath:  openmrsPath
};