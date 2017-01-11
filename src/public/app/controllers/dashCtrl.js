hivViralApp.controller('dashCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngEvents','$http','ngIdentity','$log','$filter','$window','$route','ngPatient','$cookies','ngNotifier','$timeout', function($scope,$rootScope, $modal,$routeParams,ngEvents,$http,ngIdentity,$log,$filter,$window,$route,ngPatient,$cookies,ngNotifier,$timeout) {
$("body").css("background-color", "#f7f7f7;");
$scope.identity = ngIdentity;
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
$scope.orders = [];
$scope.appointments =[];
$scope.medications = [];


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
                      links: patient.patientDetail.links,
                      visit : patient.visit
                  })
              });


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
      var currentUser = $cookies.getObject('globals').currentUser;
      $scope.patientInstance.providerId =   getProviderId(currentUser);
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
      });
      ngPatient.getAllergies($scope.patientInstance.uuid).then(function (allergyData) {
        //  console.log(allergyData);
          $scope.allergies = [];
          if (!allergyData.error) {
              $scope.allergies = allergyData.results;
          }
          //    console.log($scope.diagnoses);
      });

      ngPatient.getAppointments($scope.patientInstance.uuid).then(function(appointmentData){
          $scope.appointments = appointmentData.results;
          console.log($scope.appointments);
      });

      ngPatient.getDrugs($scope.patientInstance.uuid).then(function(drugData){
          $scope.medications = drugData.results;
          console.log($scope.medications);
      });
      ngPatient.getOrders($scope.patientInstance.uuid).then(function (orderData) {
          //  console.log(allergyData);
          $scope.orders = [];
          if (!orderData.error) {
              $scope.orders = orderData.results;
              console.log('orders ', $scope.orders );
          }

      });
      $scope.ok = function () {

          $modalInstance.close();

      };

      $scope.cancel = function () {

          $modalInstance.dismiss();

      };
  };

  $scope.viewOrderDetail = function(orderUUID) {
      $scope.orderUUID = orderUUID;
      var modalInstance = $modal.open({
          templateUrl: '/partials/labOrderDetailModal',
          controller: labOrderDetailModalCtrl,
          size: 'lg',
          keyboard: true,
          backdrop: 'static',
          resolve : {
              orderUUID: function () {
                  return $scope.orderUUID;
              }
          }
      })
    };

  var labOrderDetailModalCtrl = function($scope,$modalInstance,orderUUID){
      $scope.order = {
          openmrs : null,
          detail  : null
      }
       $http.get('/api/getOpenmrsOrderDetail/'+orderUUID).then(function(result){
           $scope.order.openmrs = result.data;
       });
      $http.get('/api/getOrderTrackingDetail/'+orderUUID).then(function(result){
          $scope.order.detail = result.data[0];

      });

      $scope.ok = function () {
          $modalInstance.close();

      };

      $scope.cancel = function () {
          $modalInstance.dismiss();
      };
  };

  $scope.showLabOrderForm = function (patientInstance) {
      $scope.patientInstance = patientInstance;
        var modalInstance = $modal.open({
            templateUrl: '/partials/labOrderModal',
            controller: labOrderModalCtrl,
            size: 'md',
            keyboard: true,
            backdrop: 'static',
            resolve : {
                patientInstance: function () {
                    return $scope.patientInstance;
                }
            }
        });
        modalInstance.result.then(function (newResult) {
            console.log('order number returned ',newResult);
            // trying to refresh to orders here
            ngPatient.getOrders($scope.patientInstance.uuid).then(function (orderData) {
                //  console.log(allergyData);
                if (!orderData.error) {
                    $scope.$parent.orders = orderData.results;
                    console.log('order refresh ', $scope.$parent.orders);

                }

            });
            // $timeout(function() {
            //     // anything you want can go here and will safely be run on the next digest.
            //     $scope.$apply();
            // })


        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    var labOrderModalCtrl = function ($scope, $modalInstance,patientInstance) {
        $scope.patientInstance = patientInstance;
        $scope.shipmentVendors =[];
        $scope.labVendors = [];
        $scope.labOrderFormData = {
            shipperId : 1,
            labId   : 1,
            comment : null
        };
        $http.get('/api/getShipmentVendors').then( function(res){
           if (res.data){
               console.log(res.data);
              $scope.shipmentVendors = res.data;
            }
        }
        );
        $http.get('/api/getLabVendors').then( function(res) {
                if (res.data) {
                    console.log(res.data);
                    $scope.labVendors = res.data;
                }
            }
        );


        $scope.createLabOrder = function() {
          //  console.log($scope.patientInstance);
            var labOrderData = {
                patient     :  $scope.patientInstance.uuid,
                shipperId : $scope.labOrderFormData.shipperId,
                labId  : $scope.labOrderFormData.labId,
                encounter   : $scope.patientInstance.visit.encounters[0].uuid,
                provider    : $scope.patientInstance.providerId,
                comment  : $scope.labOrderFormData.comment,
                instructions    : '',
                specimensource : 'blood'
            }
          //  console.log('create lab order called ', labOrderData);
            $http.post('/api/creatLabOrder',labOrderData).then(function(createOrderResult){

                if (createOrderResult.data.order_id) {
                    // confirm order has been created with an order number
                    ngNotifier.notify("Lab Order request successful.");
                    $modalInstance.close(createOrderResult.data.order_id);
                }
            });

        }

        $scope.ok = function () {
            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };


    };

function getNodeCount(document) {
        var nodeCount = 0;
        for (node in document) {
            nodeCount++;
        }
        return nodeCount;
    };

function getProviderId(currentUser) {

    // var providerId = null;
    // console.log('current user ',currentUser);
    // currentUser.roles.forEach(function(role){
    //     if (role.display =='Provider'){
    //         providerId = role.uuid;
    //     }
    // })
    return 1;  // dummy for now
}

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

