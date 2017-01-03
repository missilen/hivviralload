angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier,$location,$interval,$animate,ngIdentity, ngUser,$log,ngEventIdService,$q) {
$scope.identity = ngIdentity;
$scope.eventNameOverride = false;
$scope.minColWidth = 110;
$scope.minTopicWidth = 500;
$scope.tabCategory=[
                    {active:true}
                   ];
$animate.enabled(false);
$scope.allowSaveDrafts=false;
  var secondUnit = 1000;
  var autoSave;
  var oKtoSave = false;

  autoSave = $interval(function() {
  // repeat check if eventdoc has been changed for every 150 seconds.   
    $scope.checkDirty();
  }, 150 * secondUnit);  // change time delay here

  var changeWatcher = function() {   //function to watch for changes on eventdoc
    var unregister = $scope.$watch('eventdoc', function(newVal, oldVal) {
      $log.debug("watching");
      if (newVal != oldVal) {
        $log.debug('changed');
        $scope.allowSaveDrafts = true;
        unregister();
      }

    }, true);
  };

  $scope.$on('$destroy', function() {
  // do a final save if user close the screen
    $log.debug($scope.eventdoc );
    if($scope.eventdoc.draftStatus)
    {
      if($scope.allowSaveDrafts)
      {
        $log.debug("saving");
        $scope.saveDraftEvent();
        var parentPath = $location.path();
        if (parentPath.indexOf('dashboard/event') > -1) {
          // do not go back to dashboard since user opened modal within the active event editing screen
        }
        else {
         $location.path('/dashboard/drafts');
      }
      }
      
    }
    $interval.cancel(autoSave);

  });


  
  //$scope.topicValue = {};
  //$scope.subTopicValue = {};
  $scope.userAssigned = {};

  $scope.users = [];
  $scope.eventTypes = [];

  $scope.eventdoc = {
    "eventName": "",
    "eventType": "",
    "eventInstanceId": "",
    "userCreated": "",
    "dateCreated": "",
    "draftStatus": true,
    "archiveStatus": false,
    categories: [],
    "gridData":[],  //temporary attach to eventdoc until actual event creation
    "notes":{
      "doc":"",
      "metrics":""
    },
    "reportMeta":"",
    "checkedColumns":""
  };

   $scope.eventdoc.eventDueDate=moment().format();
   $scope.eventdoc.eventPublishDate=moment().format();

  // $scope.eventdoc.eventPublishDate=moment();


$scope.onTimeSet = function (newDate, oldDate) {
    console.log(newDate);
    console.log(oldDate);
}


  if ($scope.draftInstance) {
    $scope.eventdoc = $scope.draftInstance;
    if ($scope.eventdoc.gridData.length>0) {
       $scope.columns = generateColumnDefs();
  }
  }

  //created from existing event
  if (!$scope.isNew) {
    $scope.savedEventName = $scope.eventdoc.eventName;
    $scope.eventNameReadonly = true;
    $scope.eventNameOverrideDisable = false;
    changeWatcher();
    
  //new event 
  } else if (!$scope.draftInstance){                                           
    $scope.eventNameOverride = $scope.isNew;
    $scope.eventNameReadonly = false;
    $scope.eventNameOverrideDisable = true;

    //retrieve list of category names from db for tabs
    $http.get('/api/categories').then(function(res) {
      if (res.data[0] != undefined) {
        var cats = res.data[0].categoryList[0].categories;
        for (var i = 0; i < cats.length; i++) {
          $scope.eventdoc.categories.push(cats[i]);
        }
        changeWatcher();
      }
    });

  }

  //retrieve list of event types from db for dropdown
  $http.get('/api/eventTypes').then(function(res) {
    if (res.data.length != 0) {
      var types = res.data[0].eventTypeList[0].eventTypes;
      for (var i = 0; i < types.length; i++) {
        $scope.eventTypes.push(types[i].name);
      }
    }
  });
  
  $scope.date = new Date().getTime(); // need both date and time

  //create an object with ID and displayName for userCreated.
  $scope.eventdoc.userCreated = {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};

  var previousData = angular.toJson($scope.eventdoc);

  //retrieve list of analysts from db for dropdown
  $http.get('/api/users/analysts').then(function(res) {
    var analysts = res.data;
    for (var i = 0; i < analysts.length; i++) {
      $scope.users.push({
        'id': analysts[i]._id,
        'displayName': analysts[i].displayName
      });
    }
  });

  $log.debug($scope.date);


  $scope.addTopic = function(category,e) {
    $log.debug(category);
    if (!category.newTopicName || category.newTopicName.length === 0) {
      return;
    }
    // if ($scope.eventdoc.categories.indexOf(category).topics.length > 10) {
    //   window.alert('You can\'t add more than 10 topics!');
    //   return;
    // }
    //var topicName = document.getElementById('topicName').value;
    var topicName = category.newTopicName;
    if (topicName.length > 0) {
      category.topics.push({
        name: topicName,
        type: 'topic',
        subTopics: [],
        bullets: [],
        sortOrder: category.topics.length
      });

    }
    category.newTopicName="";
    e.preventDefault();
  };

  $scope.editTopic = function(topic) {
    topic.editing = true;
  };

  $scope.cancelEditingTopic = function(topic) {
    topic.editing = false;
  };

  $scope.saveTopic = function(topic,e) {
    // topic.save();
    topic.editing = false;
    e.preventDefault();
  };

  $scope.removeTopic = function(category, topic) {
    // if (window.confirm('Are you sure to remove this topic?')) {
    //   //topic.destroy();  //TODO
    // }
    $log.debug(category);
    $log.debug(topic);
    var index = category.topics.indexOf(topic);
    if (index > -1) {
      category.topics.splice(index, 1)[0];
    }
  };

  $scope.saveTopics = function() {
    for (var i = $scope.eventdoc.categories[0].topics.length - 1; i >= 0; i--) {
      var topic = $scope.eventdoc.categories[0].topics[i];
      topic.sortOrder = i + 1;
      // topic.save();
    }
  };

  $scope.addSubTopic = function(topic,e) {
    $log.debug(topic);
    if (!topic.newSubTopicName || topic.newSubTopicName.length === 0) {
      return;
    }
    topic.subTopics.push({
      name: topic.newSubTopicName,
      sortOrder: topic.subTopics.length,
      type: 'subTopic',
      bullets: []
    });
    topic.newSubTopicName = '';
    e.preventDefault();
    // topic.save();
  };

  $scope.removeSubTopic = function(topic, subTopic) {
    //if (window.confirm('Are you sure to remove this subTopic?')) {
    var index = topic.subTopics.indexOf(subTopic);
    if (index > -1) {
      topic.subTopics.splice(index, 1)[0];
    }
    // topic.save();
    //}
  };

  $scope.editSubTopic = function(subTopic) {
    $log.debug("edit sub topic",subTopic);
    subTopic.editing = true;
  };

  $scope.saveSubTopic = function(subTopic,e) {
    // topic.save();
    subTopic.editing = false;
    e.preventDefault();
  };

  $scope.options = {
    accept: function(sourceNode, destNodes, destIndex) {
      var data = sourceNode.$modelValue;
      var destType = destNodes.$element.attr('data-type');
      return (data.type == destType); // only accept the same type
    },
    dropped: function(event) {
      $log.debug(event);
      var sourceNode = event.source.nodeScope;
      var destNodes = event.dest.nodesScope;
      // update changes to server
      if (destNodes.isParent(sourceNode) && destNodes.$element.attr('data-type') == 'subTopic') { // If it moves in the same topic, then only update topic
        var topic = destNodes.$nodeScope.$modelValue;
        // topic.save();
      } else { // save all
        $scope.saveTopics();
      }
    },
    beforeDrop: function(event) {
      // if (!window.confirm('Are you sure you want to drop it here?')) {
      //   event.source.nodeScope.$$apply = false;
      // }
    }
  };


$scope.optionsGrid = {
    accept: function(sourceNode, destNodes, destIndex) {
      var data = sourceNode.$modelValue;
      if (data.hasOwnProperty('gridId')) {
         sourceType = 'grid';
      } else if (data.hasOwnProperty('label')) {
         sourceType = 'label';
      }
     var destType = destNodes.$element.attr('data-type');
      return (sourceType == destType); // only accept the same type
    },
    dropped: function(event) {
      $log.debug(event);
      var sourceNode = event.source.nodeScope;
      var destNodes = event.dest.nodesScope;
      // update changes to server
   },
    beforeDrop: function(event) {
      // if (!window.confirm('Are you sure you want to drop it here?')) {
      //   event.source.nodeScope.$$apply = false;
      // }
    }
  };

$scope.editLabel = function(subTopic) {
    subTopic.editing = true;
  //  console.log('i am in edit label');
  };

 $scope.saveLabel = function(subTopic,e) {
    // topic.save();
    subTopic.editing = false;
    e.preventDefault();
  };



$scope.addLabel = function(grid,e) {
   if (!grid.newSubTopicName || grid.newSubTopicName.length === 0) {
      return;
    }
    // var n = grid.dailyData.length + 1;
    grid.dailyData.push({
      'label': grid.newSubTopicName
    });
    grid.newSubTopicName = '';
    e.preventDefault();
    // topic.save();
  };


$scope.removeLabel = function(grid, subTopic) {
    //if (window.confirm('Are you sure to remove this subTopic?')) {
    var index = grid.dailyData.indexOf(subTopic);
    if (index > -1) {
      grid.dailyData.splice(index, 1)[0];
    }
    // topic.save();
    //}
  };

  $scope.createEvent = function() {
 //   var checkNamedeferred = $q.defer();
 //   checkNamedeferred.promise

    $log.debug($scope.eventdoc.eventInstanceId);
    //var minimumAssign = false;
    var analystsAssigned = 0;
    var workingId="";
    for(var i=0; i < $scope.eventdoc.categories.length; i++){
      if($scope.eventdoc.categories[i].userAssigned != '') {
        analystsAssigned++;
      }
    }
      //validation before event creation
      if ($scope.eventdoc.eventName.trim() === '') {
        ngNotifier.notifyError('Event name cannot be blank');
      } else if ($scope.eventdoc.eventName.replace(/ /g, '').match(/^[0-9]+$/) != null) {
        ngNotifier.notifyError('Event name cannot contain only numbers');
      } else if ($scope.eventdoc.eventName.replace(' ','').trim().length < 4) {
       ngNotifier.notifyError('Event name must be at least 4 characters');
      } 
       else if ($scope.eventdoc.eventType === '') {
        ngNotifier.notifyError('Please select an event type');
      } else if (analystsAssigned != $scope.eventdoc.categories.length){
        ngNotifier.notifyError('Each category must be assigned to an analyst to continue.');
      }
      else { // validation passed continue to check event Id logic
          if ($scope.isNew)
          {  //creating brand new event 
            // checking if name already exist
            $http.get('/api/events/duplicate/' + $scope.eventdoc.eventName).then(function(res) {
            if (res.data) { 
                if (res.data.duplicate){
                     ngNotifier.notifyError("Event name already exists");
                 }
                else {
                        $http.get('/api/getNextAutoId/').then(function(result) {
                          $scope.eventdoc.eventInstanceId = genPrimaryId($scope.eventdoc.eventName) + result.data.availNumber+'-001';
                          $scope.saveEvent();
                        });
                }
            }
           
          });
               
          }
          else {// create from existing
                 var primaryId = $scope.eventdoc.eventInstanceId.split('-')[0];
                 // check for the latest instance
                 $log.debug(primaryId);
                 $http.get('/api/events/getAvailEventId/' + primaryId).then(function (res) {
                  if (res.data.length>0) {
                     //break apart and reassemble
                       var idParts = res.data[0].eventInstanceId.split('-');
                       $scope.eventdoc.eventInstanceId = idParts[0]+ '-' + getnextNum(idParts[1]);
                       $scope.saveEvent();
                  }
                });
          }
     }
                             
     
                 
     $animate.enabled(true);
     
  };

  $scope.saveDraftEvent = function(clicked) {

      $log.debug($scope.date);
      $scope.eventdoc.dateCreated = $scope.date;

    $http.post('/api/events/drafts', $scope.eventdoc).then(function(res) {

      $log.debug(res.data);
      if (res.data.type=="update") {
        
        //

        if (clicked=="clicked") {
          ngNotifier.notify("Your event has been saved under drafts");
        } else {
          ngNotifier.notify("Your event has been saved under drafts automatically.");
        }



      }
      else if(res.data.type=="insert")
      {
        ngNotifier.notify("Your event has been saved under drafts");
        $scope.eventdoc = res.data.eventdoc;
        previousData = angular.toJson($scope.eventdoc);

      }

       else {
        alert('A problem was encountered with saving this event. Please contact the admistrator.');
      }
    });


  };

 
   $scope.checkDirty = function() {
     // this function compare previously saved copy of eventdoc against the current eventdoc
     // if they are not the same then save the current eventdoc
     $log.debug('check dirty fired');
     if (previousData !== angular.toJson($scope.eventdoc)) {
     $scope.saveDraftEvent('Yes');
     // re-initialize and wait for the next check
      previousData = angular.toJson($scope.eventdoc);
   }


  };



function getnextNum(numText) {

    increment =   Number(numText)+1;
    if (increment < 10) 
    {
        return ("00" + increment);
    }
    else if (increment < 100) 
    {
        return ("0" + increment);
    }
    else {
        return +increment;
    }
  }


function genPrimaryId(eventName) {
      var skipWords = ["THE", "A", "AND"];
      var nonBlanks = [];
      var uCaseEventName = eventName.toUpperCase();
      var eventNameParts = uCaseEventName.split(' ');
      if (skipWords.indexOf(eventNameParts[0]) == -1) {
             tmpEventName = uCaseEventName.replace(/ +/g, "").substring(0,2);  
      }
      else {
         // make
           tmpEventName =  uCaseEventName.replace(/ +/g, "").substring(eventNameParts[0].length).substring(0,2); 
      } 
          
      return tmpEventName;
  }


$scope.saveEvent = function()
{
  // saving the document here
    $scope.eventdoc.dateCreated = $scope.date;
    $scope.eventdoc.draftStatus = false;  
    var reload = true;
    $http.post('/api/events', $scope.eventdoc).then(function(res) {
       if (res.data.success) {
         ngNotifier.notify("Event has been created!");
         var currentPath = $location.path(); // get the current path to decide if we need to go back to dashboard or stay at the active in progress event
       if (currentPath.indexOf('dashboard/event') > -1) {  // user create event while editing existing event
              reload= false;
         }
         else {
           $location.path('/dashboard/');
          
         }
        $scope.ok(reload);
       } 
       else {
         alert('there was an error');
       }
     });
    
}


$scope.setOverrideFlags = function() {

  if($scope.eventNameOverride){
    var editConfirm = confirm('By checking this box and editing the event name, you are creating a new event.  Do you want to continue?');
  }  
   
   if($scope.eventNameOverride && editConfirm) {  // user checked the override box
      $scope.isNew = true;
      $scope.eventNameReadonly = false;
      // disable the checkbox here
      $scope.columns = generateColumnDefs();
      $scope.eventNameOverrideDisable = true;
   }
   else {// user unchecked the box
      // reset the name
      $scope.eventNameOverride = false;
      $scope.eventdoc.eventName = $scope.savedEventName;
      $scope.isNew = false;
      $scope.eventNameReadonly = true;
   //   $scope.columns = generateColumnDefs();
   }
}


// grid section
$scope.addTable = function(grid) {
 if(grid) {
  if (grid.newGridName.length > 0) {
    var initialRow = {
      'label' : ''
    }
     var initialColName = {
      'label' : 'Label'
    }

  $scope.eventdoc.gridData.push({
            gridId : $scope.eventdoc.gridData.length,
            gridName: grid.newGridName,
            dailyData: []
            });
  $scope.eventdoc.gridColDisplayNames = initialColName;
  if (!$scope.columns) {
    $scope.columns = generateColumnDefs();
  }
  grid.newGridName="";
  }
}
};

$scope.removeTable = function(gridName) {
    for(var i=0; i < $scope.eventdoc.gridData.length ; i++){
        if ($scope.eventdoc.gridData[i].gridName === gridName) {
              $scope.eventdoc.gridData.splice(i,1);
        }
    }
    
}

$scope.editTableName = function(grid) {
  grid.editing = true;
};

$scope.cancelEditingTable = function(grid) {
  grid.editing = false;
};


$scope.saveTableName = function(grid,e) {
    // topic.save();
    grid.editing = false;
    e.preventDefault();
  };

$scope.canEditGrid = function() {
  return $scope.isNew
   //return true;
 };

function generateColumnDefs() {
   var columnArry = [];
   var columnLayout = [];
   // pick a grid to iterate
   var oneGrid =  $scope.eventdoc.gridData[0];
   if (oneGrid) {  // at least one grid exist
       for (var oneColumn in oneGrid.dailyData[0]) {
          if (oneGrid.dailyData[0].hasOwnProperty(oneColumn.Name)) {
            if (columnName !== '$$hashKey' && columnName != 'label')  {
                columnArry.push(columnName);
            } 
          }
       }

    }
    else {

        $scope.addDataColumn('label');
       // columnArry.push('label');
        $scope.addDataColumn(''+$scope.eventdoc.dateCreated)
        columnArry.push(''+$scope.eventdoc.dateCreated);
    }
       columnArry.sort();
       columnArry.unshift('label');
       for(i=0; i< columnArry.length; i++) {
      // build columns defition object
         if (columnArry[i] === 'label') {
            oneColumnDef = {'field': columnArry[i], 'displayName':$scope.eventdoc.gridColDisplayNames[columnArry[i]] , enableSorting:false, minWidth: $scope.minTopicWidth, enableColumnMenu: false ,cellEditableCondition: $scope.isNew};
          }
         else {
          //  var formattedDate = $filter('date')(columnArry[i],'mediumDate');
          //  oneColumnDef = {'field': columnArry[i], 'displayName' :formattedDate, enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false,cellEditableCondition: $scope.eventNameOverride};
         }
            columnLayout.push(oneColumnDef);
       }
      // console.log(columnLayout);
       return columnLayout;
     
} 

$scope.$on('uiGridEventEndCellEdit', function () {
  //   $scope.chartData = $scope.getChartData();
  //   console.log('chart data inside grid update ', $scope.chartData );
  //   $scope.highChartConfig.series = $scope.chartData.series;
    
});

$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
 //   $scope.tabCategory[0].active = true;
});


$scope.removeColumn = function() {
     var lastColumnName = $scope.columns[$scope.columns.length-1].field.toString();
     if (lastColumnName !=='label') {
     $scope.columns.splice($scope.columns.length-1, 1);
     for(var i=0; i < $scope.eventdoc.gridData.length; i++) {
          for(var j=0; j<$scope.eventdoc.gridData[i].dailyData.length; j++){
             if ($scope.eventdoc.gridData[i].dailyData[j].hasOwnProperty(lastColumnName)) {
                delete $scope.eventdoc.gridData[i].dailyData[j][lastColumnName];
             } else {  // column not exists, add
             }
          }
      }
    }
  }
  
  $scope.addColumn = function() {
    // assuming using eventInstanceId as column name
    var newColumnName =  ''+new Date().getTime();
    var formattedDate = $filter('date')(newColumnName,'mediumDate');
    $scope.columns.push({ 'field': newColumnName, 'displayName' : formattedDate, enableSorting: false, minWidth:$scope.minColWidth, enablePinning:false});
    $scope.addDataColumn(newColumnName);
  }

 
  $scope.splice = function() {
    $scope.columns.splice(1, 0, { field: 'company', enableSorting: false });
  }
 
  $scope.unsplice = function() {
    $scope.columns.splice(1, 1);
  }

  $scope.addRow = function(grid,id) {
    var n = grid.dailyData.length + 1;
    grid.dailyData.push({
                
              });
    // var myGrid = angular.element( document.querySelector( '#'+id ) );
    // myGrid.css('height',(n+2)*30);
  };

  $scope.removeLastRow = function(grid,id) {

    var n = grid.dailyData.length;
    grid.dailyData.pop();

  }
  $scope.getTableHeight = function(grid,id) {
       var rowHeight = 30; // your row height
       var headerHeight = 30; // your header height
       if (id.split('_')[1] ===  ''+($scope.eventdoc.gridData.length-1)) {
         //  $scope.tabCategory[0].active = true;
       }
          return {
             // height: ((grid.dailyData.length+1) * rowHeight + headerHeight-12) + "px" };
              height: ((grid.dailyData.length+1) * rowHeight)+"px"
            };
       //}
       // else {
       // return {
       //    height: (grid.dailyData.length * rowHeight + headerHeight) + "px" };
       // }
    };



});
