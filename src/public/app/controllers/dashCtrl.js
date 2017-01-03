commSphereApp.controller('dashCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','ngIdentity','$log','$filter','$window','$route', function($scope, $modal,$routeParams,ngEvents,$http,ngIdentity,$log,$filter,$window,$route) {
$("body").css("background-color", "#f7f7f7;");
$scope.identity = ngIdentity
$scope.$parent.activeMenu='dashboard';
// set default sort column and direction;
$scope.sortReverse=false;
$scope.sortType = "dateCreated";
// set up pagination
$scope.totalInstances = 0;
$scope.itemsPerPage = 15;
$scope.currentPage = 1;
//Filtering events for analysts
if($scope.identity.isAuthorized('levelThree')) {  //Filtering events for analysts

  $http.get('/api/events/analyst/'+$scope.identity.currentUser._id).then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'');
           $scope.totalInstances = $scope.instances.length;
           $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
           $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'').slice(beginItem,endItem);
           $scope.sortInstances();
           } else {
               alert('no data received');
           }
  });
    
} else {

  $http.get('/api/events/active').then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           getCompletionStatus();
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'');
           $scope.totalInstances = $scope.instances.length;
           $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
           $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'').slice(beginItem,endItem);
           $scope.sortInstances();
           } else {
               alert('no data received, assign new id');
           }
      });
  }


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

function getCompletionStatus() {    
  for(var i = 0, l = $scope.instances.length; i < l; ++i){
      oneInstance = $scope.instances[i];
      var categoryCount = 0;
      var completedCount = 0;
      for (category in $scope.instances[i].categories) {
       if ($scope.instances[i].categories.hasOwnProperty(category) && ($scope.instances[i].categories[category].userAssigned != '')) {
            categoryCount++;
            }
       
        if ($scope.instances[i].categories[category].statusCompleted) { 
                 completedCount ++;      
            }
      }
        $scope.instances[i].eventInstanceStatus = Math.round((completedCount / categoryCount*100));

        $log.debug($scope.instances[i].eventInstanceStatus);
        $log.debug('category count ' + categoryCount);
        $log.debug('completed count = ' + completedCount);
  }
};


$scope.showInfo = function(instance) {
        // function to activate "moreinfomodal"
    $scope.eventdoc = instance;
        var modalInstance = $modal.open({
            scope:$scope,
            templateUrl: '/partials/moreInfoModal',
            controller: infoModalInstanceCtrl,
            windowClass: 'center-modal',
            size: 'md',
            resolve: {
                instance: function () {
                    return $scope.eventdoc;
                }
            }

        });
    };


var infoModalInstanceCtrl = function ($scope, $modalInstance) {
// controller for More Information modal popup
        $scope.instance = {};
        $log.debug('instance in modal ',$scope.instance);
        var categoryCount = 0;
        var completedCount = 0;


        for (var i = 0 ; i < $scope.eventdoc.categories.length; i++)

        {
            var oneCategory =  $scope.eventdoc.categories[i];
            var topicCount=oneCategory.topics.length;
            var subTopicCount = 0;
            for (topic in oneCategory.topics) {
                $log.debug('topic object',topic);
                subTopicCount=oneCategory.topics[topic].subTopics.length+subTopicCount;
            }

            $scope.instance[oneCategory.name]={topicCount:topicCount,subTopicCount:subTopicCount,name:oneCategory.name,userAssigned:oneCategory.userAssigned.displayName,statusCompleted:oneCategory.statusCompleted,dateCompleted:oneCategory.dateCompleted};
        }

        $log.debug('eventdoc ',$scope.eventdoc);
        $scope.ok = function () {

            $modalInstance.close();

        };

        $scope.cancel = function () {

            $modalInstance.dismiss();

        };

        $log.debug('instance object:',$scope.instance);

    };



function getNodeCount(document) {
        var nodeCount = 0;
        for (node in document) {
            nodeCount++;
        }
        return nodeCount;
    };


// // pagination functions
// $scope.$watch('$parent.searchText', function (searchText) {
//         if (!searchText){
//           searchText = '';
//         }
//           if ($scope.instances) {
//              $scope.currentPage = 1;
//              var beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
//              var endItem = beginItem + $scope.itemsPerPage;
//              $scope.beginItem=beginItem;
//               $scope.endItem=endItem;
//              $scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
//             if (searchText =='') {
//                $scope.totalInstances = $scope.instances.length;
//             }
//             else {
//                $scope.totalInstances = $scope.filteredInstances.length;
//             }
//         }
//  });

$scope.pageCount = function () {
    return Math.ceil($scope.totalInstances / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
    //$scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
  };

$scope.deleteActive = function (activeInstance) {
  // delete the passed in draft instance
    var createdDate = $filter('date')(activeInstance.dateCreated,'MM/dd/yyyy - hh:mm:ss');
    var deleteConfirm = $window.confirm('Are you sure you want to delete active instance: ' + activeInstance.eventName +' created on ' + createdDate + '? ');

    if (deleteConfirm) {
      
       $http.post('/api/events/active/delete/'+activeInstance._id).then(function(res){
       if(res.data) {
            // delete success
            $route.reload();
         } 
         else {
             alert('delete failed');
         }
    });
         
    }
    };
}]);

