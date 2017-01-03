commSphereApp.controller('dashDraftsCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','$route','$window','$filter','$log', function($scope, $modal,$routeParams,ngEvents,$http,$route,$window,$filter,$log) {

$scope.$parent.activeMenu='drafts';
$scope.sortReverse=false;
$scope.sortType = "dateCreated";
$scope.totalInstances = 0;
$scope.itemsPerPage = 15;
$scope.currentPage = 1;


$http.get('/api/events/drafts').then(function(res){
// retrieve all draft instances from the database  
     $log.debug(res.data);
     if(res.data) {
         $scope.instances=res.data;
         //$scope.filteredInstances = $filter('searchAll')($scope.instances,'');
         $scope.totalInstances = $scope.instances.length;
          $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
          $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
  //      $scope.filteredInstances = $scope.instances.slice(beginItem,endItem);
         //$scope.filteredInstances = $filter('searchAll')($scope.instances,'').slice(beginItem,endItem);
         $scope.sortInstances();
         } else {
             alert('no data received, assign new id');
         }
    });
    

$scope.editDraft = function (size,draftInstance,isNew,showOverrideCheckbox) {
// activate the modal for edit draft  
        var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: DraftEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         draftInstance: function () {
           return draftInstance;
         },
         isNew : function() { 
          // check if eventInstanceId populated.  if yes, then the instance was saved while in creating from existing event mode
            if (draftInstance.eventInstanceId !== ''){
              isNew = false;
            }
           return isNew;
         },
         showOverrideCheckbox : function() {
           return showOverrideCheckbox;
         }
       }
      });
    };

$scope.deleteDraft = function (draftInstance) {
  // delete the passed in draft instance
    var draftDate = $filter('date')(draftInstance.dateCreated,'MM/dd/yyyy - hh:mm:ss');
    var deleteConfirm = $window.confirm('Are you sure you want to delete draft:' + draftInstance.eventName +' created on ' + draftDate + '? ');

    if (deleteConfirm) {
      
       $http.post('/api/events/drafts/delete/'+draftInstance._id).then(function(res){
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

// $scope.$watch('$scope.sortType',function() {
//     console.log('sorting fired');
//     if ($scope.sortType !== '') {
//              $scope.instances = $filter('orderBy')($scope.instances,$scope.sortType, $scope.sortReverse);
//           }
// });

// $scope.$watch('$parent.searchText', function (searchText) {
//         if (!searchText){
//           searchText = '';
//         }
//           if ($scope.instances) {
//              $scope.currentPage = 1;
//              var beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
//              var endItem = beginItem + $scope.itemsPerPage;
//              $scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
//             if (searchText =='') {
//                $scope.totalInstances = $scope.instances.length;
//             }
//             else {
//                $scope.totalInstances = $scope.filteredInstances.length;
//             }
          
//         }
//  });

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

$scope.pageCount = function () {
    return Math.ceil($scope.totalInstances / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
    console.log($scope.beginItem, $scope.endItem);
//    $scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
  };

}]);

var DraftEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance,isNew,showOverrideCheckbox,$log) {
// controller for draft edit modal screen
 $scope.draftInstance = draftInstance;
 $scope.isNew = isNew;
 $scope.showOverrideCheckbox = showOverrideCheckbox;
  $scope.ok = function () {
    $log.debug("ok");
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $log.debug("canceled");
    $modalInstance.dismiss();
  };
};

 
