var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
//console.log(rootPath);
var openmrsPath = "http://localhost:8081/openmrs-standalone/";
//var openmrsPath = "http://localhost:8082/openmrs-standalone/";
//var openmrsPath = "http://lvsopenmrs2.lab.local:8081/openmrs-standalone/";
var properties = require('../lib/envProperties');

module.exports = {
	db: properties.MONGO_DOMAIN,
    rootPath: rootPath,
    openmrsPath:  openmrsPath
};