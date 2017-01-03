commSphereApp.controller('rootCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngEvents','ngAuth','$location','ngIdentity','$route','$log','$http', function($scope, $rootScope, $modal,$routeParams,ngEvents,ngAuth, $location, ngIdentity,$route,$log,$http) {
$rootScope.continueNav = true;
$("#wrapper").show();
$scope.activeMenu='';
$scope.searchText='';
$scope.identity = ngIdentity;

if($scope.identity.currentUser === undefined){  //changed background color based on authenticated or not
  $("body").css("background-color", "#2a2d33;");
}
else
{
  $("body").css("background-color", "#f7f7f7;");
  //$scope.roleTypes="";
}


$scope.createEvent = function (size,draftInstance,isNew,showOverrideCheckbox) {

      var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: CreateEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         draftInstance: function () {
           return draftInstance;
         },
         isNew : function() {
            return isNew;
          },
         showOverrideCheckbox : function() {
           return showOverrideCheckbox;
         }
      }
      });
    
    };

$scope.logout = function(){
    if (!$rootScope.continueNav) {
        var answer = confirm("You have unsaved changes, do you want to continue?")
          if (!answer) {
            event.preventDefault();
          }
          else {
        		ngAuth.logoutUser().then(function() {
            $rootScope.continueNav = true;
      			$scope.email = "";
      			$scope.password = "";
    			//This is for PIV
      
    //			if($location.protocol()=='https'){
    //				$window.location = $location.absUrl().replace('https','http').replace('4400','8089');
    //			}
    //			else{
    //				$location.path('/');    /
    //			}
            $location.path('/login')
            $("body").css("background-color", "#2a2d33;");
      		});
      }
    }
    else {

      ngAuth.logoutUser().then(function() {
            $scope.email = "";
            $scope.password = "";
          //This is for PIV
      
    //      if($location.protocol()=='https'){
    //        $window.location = $location.absUrl().replace('https','http').replace('4400','8089');
    //      }
    //      else{
    //        $location.path('/');    /
    //      }
            $location.path('/login')
            $("body").css("background-color", "#2a2d33;");
          });

    } 

  
};

  $scope.showAvailEvents = function (size) {
  // retrieve all events with active and archived status pending users requirements
      var modalInstance = $modal.open({
        templateUrl: '/partials/availEventsModal',
        controller: importEventModalCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static'
      });
      modalInstance.result.then(function (newResult) {
      // user selected one event, pass it to create event function
      // also need to check for copy option
          var selectedInstance = newResult.selectedInstance;
          var copyOption = newResult.copyOption;
          $scope.cleanDoc(selectedInstance,copyOption);
          //$scope.createEvent('lg',selectedInstance,false,true); 
      }, function () {
   //         $log.info('Modal dismissed at: ' + new Date());
      });
  };
     
$scope.cleanDoc = function(selectedInstance,copyOption)
{ 
  delete selectedInstance._id;
 //  selectedInstance.eventInstanceId = "";
   selectedInstance.userCreated =  {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};
   selectedInstance.dateCreated = "";
   selectedInstance.draftStatus = true;
   selectedInstance.archiveStatus =  false;
    var metricsTemplate = [];
    selectedInstance.notes = {"doc":"","metrics":""};
    selectedInstance.reportMeta = {"title":"","type":""};
    selectedInstance.chartConfigs = [];
    selectedInstance.checkedColumns = {};
   for (var i=0; i < selectedInstance.categories.length; i++)
   {
       selectedInstance.categories[i].statusCompleted = false;
       selectedInstance.categories[i].dateCompleted = "";
       selectedInstance.categories[i].checked = false;   //setting checked status to false
       if (copyOption.selectedOption === 2) {
        // clear bullets under sub topics here
          topics = selectedInstance.categories[i].topics;
          if (topics) {
            for (var j=0; j < topics.length; j++){  
              topics[j].checked = false;
              subTopics = topics[j].subTopics;
              if (subTopics) {
                for (var k=0; k < subTopics.length; k++ ) { // loop through subtopics and remove the bullets
                    subTopics[k].checked = false;
                   if (subTopics[k].bullets) {
                     subTopics[k].bullets = [];
                   }
                }
              }
              // clear sub bullet under bullets under topics
              bullets = topics[j].bullets;
              if (bullets) {
                   topics[j].bullets = [];
                // for (var k=0; k < bullets.length; k++ ) { // loop through subtopics and remove the bullets
                //    if (bullets[k].subBullets) {
                //     delete bullets[k].subBullets;
                //    }
                // }
              }
            }
          }
     }
   }
   if (copyOption.copyMetric){
   // attach a dailymetrics to draft instance here
   //  console.log('copy template activated');
     $http.get('api/events/data/'+selectedInstance.eventInstanceId).then(function(res){
      
       if(res.data) {
              // copy column label only
             var gridData = res.data[0].gridData;
             for (i=0; i < gridData.length; i++) {
                   var oneGrid = {
                                    'gridName': gridData[i].gridName,
                                    'dailyData' : []
                                 }
                   for (j=0; j < gridData[i].dailyData.length; j++) {
                      var oneRow = {
                                           'label' : gridData[i].dailyData[j]['label']
                                       }
                      oneGrid.dailyData.push(oneRow);
                   }
              metricsTemplate.push(oneGrid);

             }
              // attaching column display name
              selectedInstance.gridColDisplayNames = res.data[0].colDisplayNames;
           } else {
               alert('no Eventdata received');
           }
       selectedInstance.gridData = metricsTemplate;
       $scope.createEvent('lg',selectedInstance,false,true); 
  });
  }
  else {
   $scope.createEvent('lg',selectedInstance,false,true); 
   $log.debug(selectedInstance);
 }
};
}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$animate,draftInstance,isNew,showOverrideCheckbox) {
 $scope.draftInstance = draftInstance;
 $scope.isNew = isNew;
 $scope.showOverrideCheckbox = showOverrideCheckbox;
 $scope.ok = function (reload) {
    $animate.enabled(true);
    $modalInstance.close();
    if (reload) {
     $timeout($route.reload,500);
    }
  };

  $scope.cancel = function () {
    $animate.enabled(true);
    $modalInstance.dismiss();
    // if (reload) {
    //   $timeout($route.reload,500);
    // }
  };
};


var importEventModalCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$http,$filter,$modal) {
// display modal popup to show list of available events   
$scope.sortReverse=false;
$scope.sortType = "dateCreated";

//setup pagination here
$scope.totalInstances = 0;
$scope.itemsPerPage = 10;
$scope.currentPage = 1;

  $http.get('/api/events/getEventsForImport').then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'');
           $scope.totalInstances = $scope.instances.length;
          $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
          $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'').slice(beginItem,endItem);
            $scope.sortInstances();
           } else {
               alert('no data received');
           }
  });
      


  $scope.importInstance = function(instance) {
    // need to add a popup here to ask user to select copy option 
     $modalInstance.close(instance);

  };

  
  
  $scope.ok = function () {
    $modalInstance.close();
    $route.reload();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
    $route.reload();
  };
  
 //  $scope.$watch('searchText', function (searchText) {
 //        if (!searchText){
 //          searchText = '';
 //        }
 //          if ($scope.importInstances) {
 //             $scope.currentPage = 1;
 //             var beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
 //             var endItem = beginItem + $scope.itemsPerPage;
 //             $scope.filteredInstances = $filter('searchAll')($scope.importInstances,searchText).slice(beginItem,endItem);
 //            if (searchText =='') {
 //               $scope.totalInstances = $scope.importInstances.length;
 //            }
 //            else {
 //               $scope.totalInstances = $scope.filteredInstances.length;
 //            }
 //        }
 // });
  $scope.pageCount = function () {
    return Math.ceil($scope.totalInstances / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
    //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,searchText).slice(beginItem,endItem);
  };

  $scope.sortInstances = function(sortType) {
  if($scope.sortReverse)
  {
    $scope.instances.sort(compareAsc);  
  }
  else
  {
    $scope.instances.sort(compareDesc);
  }

}

function compareAsc(a,b) {
  if($scope.sortType=="coordinatorAssign")
  {
    if ((a.userCreated.displayName).toString().toLowerCase() < (b.userCreated.displayName).toString().toLowerCase())
      return -1;
    if ((a.userCreated.displayName).toString().toLowerCase() > (b.userCreated.displayName).toString().toLowerCase())
      return 1;
    return 0;
  }
  else
  {
    if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
      return -1;
    if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
      return 1;
    return 0;
  }
}

function compareDesc(a,b) {
  if($scope.sortType=="coordinatorAssign")
  {
    if ((a.userCreated.displayName).toString().toLowerCase() > (b.userCreated.displayName).toString().toLowerCase())
      return -1;
    if ((a.userCreated.displayName).toString().toLowerCase() < (b.userCreated.displayName).toString().toLowerCase())
      return 1;
    return 0;
  }
  else
  {
    if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
      return -1;
    if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
      return 1;
    return 0;
  }
}

$scope.showCopyOption = function (size,selectedInstance) {
  // retrieve all events with active and archived status pending users requirements
     
      var modalInstance2 = $modal.open({
        templateUrl: '/partials/copyOptionModal',
        controller: copyOptionModalCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         selectedInstance: function () {
           return selectedInstance;
         }
      
        } 
      });
      modalInstance2.result.then(function (copyOption) {
      // user selected one event, pass it to create event function
        //  $scope.cleanDoc(selectedInstance,copyOption);
          var newResult = {'selectedInstance':selectedInstance, 'copyOption': copyOption};
          $modalInstance.close(newResult)
      }, function () {
           
      });


     };


var copyOptionModalCtrl = function ($scope, $modalInstance,$location,$route,$timeout,selectedInstance) {
  $scope.selectedInstance = selectedInstance;
  $scope.copyMetricTemplate = true;  // always copy the daily metrics grid for now.
   $scope.copyOptions = [{
        displayText: "Copy template only",
        optionValue : 2,
        checked: true
    },
    {
        displayText: "Copy template with data",
        optionValue : 1,
        checked: false
    }];

    $scope.copyMetricOptions  =  {
      displayText: "Copy Daily Metrics Template",
        optionValue : 1,
        checked: false
    }
    $scope.selectedOption = $scope.copyOptions[0].optionValue;
   
    
    // $scope.copyOptionSelected = function(option) {
    //     angular.forEach($scope.copyOptions, function(oneOption) {
    //         oneOption.checked = false;
    //     });
    //     option.checked = true;
    //     $scope.selectedOption = option; 
    // };
 
  $scope.accept = function (selectedOption,copyMetricTemplate) {
    var selectedOptions = { 'selectedOption': selectedOption, 'copyMetric': copyMetricTemplate}
    $modalInstance.close(selectedOptions);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
    
  };

}


};


