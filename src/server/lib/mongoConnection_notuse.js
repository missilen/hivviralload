var MongoClient = require('mongodb').MongoClient;
var properties = require('./envProperties');
  //, assert = require('assert');

// Connection URL
var url = properties.MONGO_DOMAIN;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  //assert.equal(null, err);
  console.log("Connected correctly to server");
  exports.mongodb=db;

});