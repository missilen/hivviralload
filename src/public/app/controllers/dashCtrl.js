hivViralApp.controller('dashCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngEvents','$http','ngIdentity','$log','$filter','$window','$route','ngPatient', function($scope,$rootScope, $modal,$routeParams,ngEvents,$http,ngIdentity,$log,$filter,$window,$route,ngPatient) {
$("body").css("background-color", "#f7f7f7;");
$scope.identity = ngIdentity
$scope.$parent.activeMenu='dashboard';
// set default sort column and direction;
$scope.sortReverse=false;
$scope.sortType = "dateCreated";
// set up pagination
$scope.totalPatients = 0;
$scope.itemsPerPage = 15;
$scope.currentPage = 1;
$scope.diagnoses = [];
$scope.allergies =[];

  $http.get('/api/getPatientList').then(function(res){
      if (res.data){
          $scope.patientList = [];
          var uniquePatients = _.uniq(res.data, function(x){
              return x.patientDetail.display;
          });

          uniquePatients.forEach(function(patient) {
                  $scope.patientList.push({
                      patientId: patient.patientDetail.display.split('-')[0].trim(),
                      name: patient.patientDetail.display.split('-')[1].trim(),
                      birthDate: patient.patientDetail.person.birthdate,
                      uuid: patient.patientDetail.uuid,
                      identifiers: patient.patientDetail.identifiers,
                      links: patient.patientDetail.links
                  })
              })


          //          console.log($scope.patientList);
          $scope.totalPatients = $scope.patientList.length;
      }
  })

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

  $scope.showPatientInfo = function(patientInstance) {
      $scope.patientInstance = patientInstance;
      var modalInstance = $modal.open({
          scope:$scope,
          templateUrl: '/partials/patientInfoModal',
          controller: patientInfoModalCtrl,
          windowClass: 'center-modal',
          size: 'lg',
          resolve: {
              patientInstance: function () {
                  return $scope.patientInstance;
              }
          }
      });
  };

  var patientInfoModalCtrl = function($scope, $modalInstance) {
      //console.log($scope.patientInstance);
      $scope.diagnoses = [];
      ngPatient.getEncounters($scope.patientInstance.uuid).then(function (encounterData) {
        //  console.log(encounterData);
          encounterData.forEach(function (encounter) {
              encounter.obs.forEach(function(ob){
                  if (ob.concept.uuid === '159947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
                      ob.groupMembers.forEach(function(member) {
                          if (member.concept.uuid === "1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"){
                              var oneDiagnose = {
                                  'encounterDatetime': encounter.encounterDatetime,
                                  'location': encounter.location,
                                  'ob': ob,
                                  'display' : member.display.split('PROBLEM LIST:')[1],
                                  'links': ob.links
                              }
                              $scope.diagnoses.push(oneDiagnose);
                          }
                      })

                  }
              })
          })
      //    console.log($scope.diagnoses);
      })
      ngPatient.getAllergies($scope.patientInstance.uuid).then(function (allergyData) {
        //  console.log(allergyData);
          $scope.allergies = [];
          if (!allergyData.error) {
              $scope.allergies = allergyData.results;
          }
          //    console.log($scope.diagnoses);
      })
      $scope.ok = function () {

          $modalInstance.close();

      };

      $scope.cancel = function () {

          $modalInstance.dismiss();

      };
  };

// $scope.showInfo = function(instance) {
//         // function to activate "moreinfomodal"
//     $scope.eventdoc = instance;
//         var modalInstance = $modal.open({
//             scope:$scope,
//             templateUrl: '/partials/moreInfoModal',
//             controller: infoModalInstanceCtrl,
//             windowClass: 'center-modal',
//             size: 'md',
//             resolve: {
//                 instance: function () {
//                     return $scope.eventdoc;
//                 }
//             }
//
//         });
// };


// var infoModalInstanceCtrl = function ($scope, $modalInstance) {
// // controller for More Information modal popup
//         $scope.instance = {};
//         $log.debug('instance in modal ',$scope.instance);
//         var categoryCount = 0;
//         var completedCount = 0;
//
//
//         for (var i = 0 ; i < $scope.eventdoc.categories.length; i++)
//
//         {
//             var oneCategory =  $scope.eventdoc.categories[i];
//             var topicCount=oneCategory.topics.length;
//             var subTopicCount = 0;
//             for (topic in oneCategory.topics) {
//                 $log.debug('topic object',topic);
//                 subTopicCount=oneCategory.topics[topic].subTopics.length+subTopicCount;
//             }
//
//             $scope.instance[oneCategory.name]={topicCount:topicCount,subTopicCount:subTopicCount,name:oneCategory.name,userAssigned:oneCategory.userAssigned.displayName,statusCompleted:oneCategory.statusCompleted,dateCompleted:oneCategory.dateCompleted};
//         }
//
//         $log.debug('eventdoc ',$scope.eventdoc);
//         $scope.ok = function () {
//
//             $modalInstance.close();
//
//         };
//
//         $scope.cancel = function () {
//
//             $modalInstance.dismiss();
//
//         };
//
//         $log.debug('instance object:',$scope.instance);
//
//     };



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
//                $scope.totalPatients = $scope.instances.length;
//             }
//             else {
//                $scope.totalPatients = $scope.filteredInstances.length;
//             }
//         }
//  });

$scope.pageCount = function () {
    return Math.ceil($scope.totalPatients / $scope.itemsPerPage);
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

