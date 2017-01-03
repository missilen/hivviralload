var mongo = require('../lib/mongoConnection');
var fs  = require('fs');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config/config');
var _ = require('lodash');


exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	

	// var modifiedPath = req.files.file.path;
	// // var re = new RegExp('[\/][i][m][g]\s*([^\n\r]*)');
	// modifiedPath = modifiedPath.substring(modifiedPath.indexOf('/img'));
	// console.log(req.body);
	// //console.log('modified path ' + modifiedPath);

	var uploadDoc = req.body;
	// uploadDoc.eventId = req.body.eventId;
	// uploadDoc.fileName = req.files.file.name;
	// uploadDoc.filePath =  modifiedPath;
	uploadDoc.date = new Date();
	uploadDoc.checked = false;

	// console.log('Uploaded Doc**', uploadDoc);
	collection.insert(uploadDoc, function(err, result) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
			res.send({
				success: true,
				result: result
			});
		}
	});
};

exports.getFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var partialId = new RegExp('^'+req.params.id.split('-')[0]);
	collection.find({'eventId': {$regex: partialId}}).toArray(function(err,fileDoc){
		// console.log('before sort:', fileDoc);
		fileDoc = _.sortBy(fileDoc, 'date');
		fileDoc = fileDoc.reverse();
		// console.log('after sort:', fileDoc);
        res.send(fileDoc);
	});
};

exports.deleteFile = function(req,res) {
	var Id = req.body._id;
	// var filePath = config.rootPath+'/public/'+req.body.filePath;
	var collection = mongo.mongodb.collection('uploads');
	//console.log(req.body);
	if (Id) { 

		collection.remove({
			"_id": ObjectID(Id)
		}, function(err, result) {
			if (err) {
				res.send(err);
				console.log(err);
			} else {
				//console.log("document deleted", result);
				// fs.unlinkSync(filePath);
				res.send({
					success: true,
					result:result
				});
			}
		});
	}
};

exports.updateFileChecked = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	//console.log(req.body);
	var files = req.body;

	for(var i = 0; i < files.length; i++) {

		var Id = req.body[i]._id;
		console.log(Id);
		collection.update({'_id':ObjectID(Id)}, { $set: {checked:req.body[i].checked}},function(err,result) {
			if(err) {
				res.send(err);
				console.log(err);
			} else {
				console.log("image checked updated", result);
				res.send({
					success: true,
					result: result
				});
			}

			
		});
	}
}