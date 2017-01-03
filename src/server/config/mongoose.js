var mongoose = require('mongoose'),
  userModel = require('../models/User'),
eventInstance = require('../models/EventInstance');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('commSphere db opened');
  });

  userModel.createDefaultUsers();
 

};

