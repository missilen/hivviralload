
var mongo = require('../lib/mongoConnection');
var ObjectId = require('mongodb').ObjectID;

//var EventInstance = require('mongoose').model('EventInstance')

exports.getEvents = function(req, res) {

    
    var collection = mongo.mongodb.collection('events');
    var draftStatus = (req.params.status === 'drafts');
  collection.find({'draftStatus' : draftStatus}).sort('-dateCreated').toArray(function(err, eventInstances) {
        res.send(eventInstances);

      
  });
  };

exports.getEventById = function(req, res) {

//    console.log(req.params.id);
    var id=req.params.id;
    var collection = mongo.mongodb.collection('events');
    collection.find({
        _id: ObjectId(id)
    }).toArray(function(err, eventdoc) {
  //    console.log("eventdoc",eventdoc);
        res.send(eventdoc);
    });



  };

exports.getAvailEventInstanceId = function(req,res) {
    
    var collection = mongo.mongodb.collection('events');
     var partialId = new RegExp('^'+req.params.partialId.split('-')[0]);

     collection.find({'eventInstanceId': {$regex: partialId}}).sort({'dateCreated':-1}).limit(1).toArray(function(err,docs){
         res.send(docs);
         
     });
};
  exports.getEventInstanceInfo = function (req,res) {
    
     var collection = mongo.mongodb.collection('events');
     var eventId = req.params.Id;

     collection.find({'eventInstanceId': eventId}).toArray(function(err,docs){
         res.send(docs);
  });

};
   

  

  