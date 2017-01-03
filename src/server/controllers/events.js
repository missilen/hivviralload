var mongo = require('../lib/mongoConnection');
var ObjectID = require('mongodb').ObjectID;


exports.saveEvent = function(req, res) {
	var eventData = req.body;
	//console.log('b4 update ',eventData);
	var dailyMetricsTemplate = eventData.gridData;
	var gridCols = eventData.gridColDisplayNames;
	//console.log("req body****",req.body);
	var Id = eventData._id;
  	delete eventData._id;
	var collection = mongo.mongodb.collection('events');
	var eventDataCollection = mongo.mongodb.collection('eventsData');
	// detach daily metics if exist
	if (dailyMetricsTemplate) {
	  	 		delete eventData.gridData
	  	 		delete eventData.gridColDisplayNames;
	 		}
	if (Id) {  // if existing id then update
	  // check if this is draft save or creation  
	   collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       if (err) {
			res.send(err);
			console.log(err);
		}
		else {
       console.log("document changed ", affectedDocCount);
        // add a daily metrics here succesfully update 
       if (affectedDocCount > 0 && !eventData.draftStatus) {
       	  createDailyMetrics(eventData.eventInstanceId,eventData.eventName,eventData.dateCreated,dailyMetricsTemplate,gridCols)
       }

	   res.send({success:true});
		}
   		});
	}
	else {
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			// create matching data collection for this new event if not exist	
				if (!eventData.draftStatus) {
       	 			 createDailyMetrics(eventData.eventInstanceId,eventData.eventName,eventData.dateCreated,dailyMetricsTemplate,gridCols)
       			}
			res.send({success:true});
		}
 	});
  }
};



exports.saveDraft = function(req,res) {
  var eventData = req.body;
  var Id = eventData._id;
  console.log('I am in save draft');
  delete eventData._id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 console.log("ID true",Id);
      collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
       console.log("document changed ", affectedDocCount);
	   res.send({type:"update"});
		}
   	 });
	}
	else {
		console.log(" I am in draft insert");
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			// send the inserted record new id back to ctrl
			res.send({'eventdoc': result[0],type:"insert"});
		}
 	});
  }

};

exports.deleteDraft = function(req,res) {
	 
  var Id = req.params.Id;
  console.log('I am in delete draft');
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
    collection.remove({"_id":ObjectID(Id)},function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
			console.log("document deleted", affectedDocCount);
			res.send({success:true});
		}
   	});
	}
};

exports.saveCollectedData = function(req,res) {
	var eventData = req.body;
	var Id = eventData._id;
  	delete eventData._id;
	var collection = mongo.mongodb.collection('eventsData');
	if (Id) {  // if existing id then update
     	collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       		if (err) {
				res.send(err);
				console.log(err);
			} else {
  		   		res.send({success:true});
			}
   		});
	}

}

exports.saveChartData = function (req,res) {
  var data = req.body;
  var Id = data.docId;
  var chartData = data.chartData;
  
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
     collection.update({"_id":ObjectID(Id)},{$set : {"chartConfigs" : chartData}},function(err, affectedDocCount) {
	 if (err) {
           res.send(err);
           console.log(err);
		   console.log('charts save encountered error');
	 }
	 else {
       console.log("document changed ", affectedDocCount);
                 res.send({success:true});
                             }
               });
              }
	
};

exports.getEventsByAnalyst = function (req,res) {
	var analystId = req.params.analystId;
	console.log("analyst id", analystId);
    var collection = mongo.mongodb.collection('events');
	collection.find({'draftStatus':false,'categories':{$elemMatch:{'userAssigned.id': analystId, 'statusCompleted' :false}}}).toArray(function(err,eventInstances) {
	  	if(err){
	 	 	console.log(err);
	 	 } else {
			  
		  	res.send(eventInstances);
		 }
	 });
	
};

exports.saveEventCategory = function (req,res) {
  var data = req.body;
  var Id = data.docId;
  var categoryData = data.categoryData;
  
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
     collection.update({"_id":ObjectID(Id),"categories.name":categoryData.name },{$set : {"categories.$" : categoryData}},function(err, affectedDocCount) {
	 if (err) {
           res.send(err);
           console.log(err);
		   console.log('category update encountered error');
	 }
	 else {
       console.log("document changed ", affectedDocCount);
                 res.send({success:true});
                             }
               });
              }
	
};
exports.findDuplicate = function(req, res) {
	 var eventName =  new RegExp(req.params.eventName,'i');
	 var collection = mongo.mongodb.collection('events');
	 collection.find({'eventName': {$regex: eventName}, 'draftStatus': false}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};

exports.findDuplicateId = function(req, res) {
	 var eventId = req.params.eventId;
	 var collection = mongo.mongodb.collection('events');
	 collection.find({'eventInstanceId': eventId, 'draftStatus': false}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};

exports.getEventsForImport = function(req, res) {
// get all active and archived events    
var collection = mongo.mongodb.collection('events');
collection.find( { $or: [{'draftStatus' : false},{'archiveStatus' : true}]}).toArray(function(err, eventInstances) {
        res.send(eventInstances);
  });
  };


exports.deleteActiveEvent = function(req,res) {
// delete event by id.  could have used the same delete draft function but we may need to include other criteria or functionality such as archiving
// instead of permanent delete	 
  var Id = req.params.Id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
    collection.remove({"_id":ObjectID(Id)},function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
			console.log("document deleted", affectedDocCount);
			res.send({success:true});
		}
   	});
	}
};
 
exports.getAvailEventInstanceId = function(req,res) {
    
    var collection = mongo.mongodb.collection('events');
     var partialId = new RegExp('^'+req.params.partialId.split('-')[0]);
     collection.find({'eventInstanceId': {$regex: partialId},'draftStatus':false}).sort({'dateCreated':-1}).limit(1).toArray(function(err,docs){
         res.send(docs);
     });
};

exports.getNextAutoId = function(req,res){
	var collection = mongo.mongodb.collection('eventCounters');
	collection.find().toArray(function(err1, items) {
		if (items.length >= 1) {

			var availNumber = items[0].nextAutoId;
			if (availNumber > 9999) {
				res.send({'error':'next available id has reached limit of 9999'});
			}
			else {
				collection.update({},{ $inc: { nextAutoId: 1 }},function(err, affectedDocCount) {
					if (err) {
						res.send(err);
						console.log(err);
					}
					else {
	       			//	console.log("document changed ", affectedDocCount);
		   	  		}
				});
				res.send({'availNumber': getPaddedNum(availNumber,3)});
			}
		}
		else {
		  // collection not found , create one
		   console.log('not found')
		   collection.insert({'nextAutoId':2}, function(err, result) {
		   	  if (result){
		   	  console.log('creating collection eventCounters');

		   	  res.send({'availNumber': getPaddedNum(1,3)});
			  }
			})
   	   	}
   			
	});
	
}

function getPaddedNum(numText,padLength) {
 var zeroes="";
 var numberLen = numText.toString().length;
   for (var i=0; i<= padLength-numberLen; i++){
       zeroes = zeroes + '0';
   }
   return zeroes + numText;
 
}

function createDailyMetrics(eventInstanceId,eventName,dateCreated,gridData,gridCols){
	var eventDataCollection = mongo.mongodb.collection('eventsData');
  	var partialId = new RegExp('^'+eventInstanceId.split('-')[0]);		
	eventDataCollection.find({'eventInstanceId': {$regex: partialId}}).toArray(function(err,result) {
	  	if(err){
			console.log(err);
	 	} else if (result.length < 1) {
			 	 	// not exist, add
			 	 	  for(var i=0; i < gridData.length; i++) {
					        var oneGrid = gridData[i];
					        for (var j=0; j < oneGrid.dailyData.length; j++) {
					           if (oneGrid.dailyData[j].hasOwnProperty(''+dateCreated)) {
					           } else {  // column not exists, add
					               oneGrid.dailyData[j][''+dateCreated] = '*';
					               var formattedDate = getFormattedDate(dateCreated);
					               gridCols[''+dateCreated] = formattedDate;
					           }
					        }
					  }
			 	 	  var newRecord = {
			 	 	  			 "eventName": eventName,
			 	 	  		  	"eventInstanceId": eventInstanceId,
			 	 	  		  	"colDisplayNames" : gridCols,
			 	 	  		  	"gridData" : gridData
			 	 	  		  	};

			 	 	  	//newRecord.gridData[0].dailyData[0][creationDate] = '*';
			 	 	 	eventDataCollection.insert(newRecord, function(err, result) {
							if(err) {
							res.send(err);
							console.log(err);
							} else {
								
							}
			 			});
	 	 	  		}
	 	 	  		else {  // event data already exists,  add the next column the for new instance
	 					  for (var i=0; i < result[0].gridData.length; i++){
	 					     for(var j=0; j < result[0].gridData[i].dailyData.length; j++) {
						           if (result[0].gridData[i].dailyData[j].hasOwnProperty(''+dateCreated)) {
						              // column alread there
						           } else {  // column not exists, add
						               result[0].gridData[i].dailyData[j][''+dateCreated] = '*';
						               var formattedDate = getFormattedDate(dateCreated);
					               	   result[0].colDisplayNames[''+dateCreated] = formattedDate;
						           }
						      }
						   }   
						  console.log(result[0]);
						  var Id = result[0]._id;
						  delete result[0]._id;   
						  eventDataCollection.update({"_id":ObjectID(Id)},result[0],function(err, affectedDocCount) {
						       if (err) {
									res.send(err);
									console.log(err);
								}
								else {
						       console.log("event data document changed ", affectedDocCount);
								}
						   		});
  // end of eventdata exist
	 	 	  		}
	 	 	  	});		
}

function getFormattedDate(inDate) {
	var myDate = new Date(inDate).toDateString().split(' ');
	var formattedDate = myDate[1] + ' ' + myDate[2].replace(/^0+/, '')+', '+ myDate[3];
	return formattedDate;
}

exports.getDataById = function(req,res){
	var collection = mongo.mongodb.collection('eventsData');
	var partialId = new RegExp('^'+req.params.id.split('-')[0]);
	collection.find({'eventInstanceId': {$regex: partialId}}).toArray(function(err,docs){
         res.send(docs);

	})
}

exports.deActivateInstance = function(req,res) {
	 
  var Id = req.params.Id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
    collection.update({"_id":ObjectID(Id)}, {$set:{ 'draftStatus':'inActive'}},function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
			console.log("document deleted", affectedDocCount);
			res.send({success:true});
		}
   	});
	}
};
