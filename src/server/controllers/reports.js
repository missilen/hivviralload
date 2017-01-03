var mongo = require('../lib/mongoConnection');
var ObjectId = require('mongodb').ObjectID;

exports.saveCustomizedReport = function(req, res) {
	var collection = mongo.mongodb.collection('reports');
	var customReport = req.body;
	var Id = customReport._id;
	
	collection.update({
		'_id': Id
	}, customReport, {upsert: true}, function(err, result) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.send({success:true});
		}
	});

};

exports.getCustomizedReport = function(req, res) {
	var collection = mongo.mongodb.collection('reports');
	var eventDocId=req.params.eventDocId;

	collection.find({'eventDocId':eventDocId}).toArray(function(err, customReport) {
		res.send(customReport);
	});
};