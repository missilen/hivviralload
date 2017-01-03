var mongoose = require('mongoose');
//var eventInstanceSchema = new mongoose.Schema({
//  "eventName"   : {type: String},
//  "eventId"     : {type: String},
//  "eventInstanceId": {type: String},
//  "isDraft"     : {type: Boolean},
//  "eventInstanceStatus" : {type : Number},
//  "categories": { type : String}
//                     }
//,  {collection:'events'});

var eventInstanceSchema = new mongoose.Schema({},{collection:'events'});
 module.exports = mongoose.model('EventInstance', eventInstanceSchema);