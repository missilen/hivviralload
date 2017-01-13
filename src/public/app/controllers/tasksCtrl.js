hivViralApp.controller('tasksCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngEvents','$http','ngIdentity','$log','$filter','$window','$route','ngPatient','$cookies','ngNotifier','$timeout', function($scope,$rootScope, $modal,$routeParams,ngEvents,$http,ngIdentity,$log,$filter,$window,$route,ngPatient,$cookies,ngNotifier,$timeout) {
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

$scope.appointments =[];
$scope.medications = [];





  $http.get('/api/getPatientList').then(function(res){
      if (res.data){
          $scope.patientList = res.data;
          // res.data.forEach(function(patient) {
          //         $scope.patientList.push({
          //             patientId: patient.display.split('-')[0].trim(),
          //             name: patient.display.split('-')[1].trim(),
          //             birthDate: patient.person.birthdate,
          //             uuid: patient.patientDetail.uuid,
          //             identifiers: patient.identifiers,
          //             links: patient.links,
          //         })
          //     });


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
      $scope.patientInstance.uuid = $scope.patientInstance.patient.uuid;
      $scope.patientInstance.patientId = $scope.patientInstance.display.split('-')[0];
      $scope.patientInstance.name = $scope.patientInstance.display.split('-')[1];
      $scope.patientInstance.orders =[];
    //  $scope.patientInstance.labOrderDetail = null;
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



      var currentUser = $cookies.getObject('globals').currentUser;
      $scope.patientInstance.providerId =   getProviderId(currentUser);
      ngPatient.getOrders($scope.patientInstance.uuid).then(function (orderData) {
          $scope.patientInstance.orders = [];
          if (!orderData.error) {
              $scope.patientInstance.orders = orderData.results;
          }
      });
      ngPatient.getEncounters($scope.patientInstance.uuid).then(function (encounterData) {
        //  console.log(encounterData);
          $scope.patientInstance.diagnoses = [];
          $scope.patientInstance.hivEncounters = [];
          encounterData.forEach(function (encounter) {


              if (encounter.encounterType.uuid == 'dd2fdfa5-31ea-4686-b5f3-0d078d63e87d'){
                  $scope.patientInstance.hivEncounters.push(encounter);
                  console.log('one encounter ', encounter);
              }
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
                              $scope.patientInstance.diagnoses.push(oneDiagnose);
                          }
                      })

                  }
              })
          })
      //    console.log($scope.diagnoses);
      });
      ngPatient.getAllergies($scope.patientInstance.uuid).then(function (allergyData) {
        //  console.log(allergyData);
          $scope.patientInstance.allergies = [];
          if (!allergyData.error) {
              $scope.patientInstance.allergies = allergyData.results;
          }
          //    console.log($scope.diagnoses);
      });

      // ngPatient.getAppointments($scope.patientInstance.uuid).then(function(appointmentData){
      //     $scope.patientInstance.appointments = appointmentData.results;
      //     console.log($scope.patientInstance.appointments);
      // });
      //
      // ngPatient.getDrugs($scope.patientInstance.uuid).then(function(drugData){
      //     $scope.patientInstance.medications = drugData.results;
      //     console.log($scope.patientInstance.medications);
      // });


      $scope.ok = function () {

          $modalInstance.close();

      };

      $scope.cancel = function () {

          $modalInstance.dismiss();

      };
  };

  $scope.viewOrderDetail = function(labOrder) {
      var modalInstance = $modal.open({
          templateUrl: '/partials/labOrderDetailModal',
          controller: labOrderDetailModalCtrl,
          size: 'lg',
          keyboard: true,
          backdrop: 'static',
          resolve : {
              labOrder: function () {
                  return labOrder;
              }
          }
      })
    };

  var labOrderDetailModalCtrl = function($scope,$modalInstance,labOrder){
      $scope.labOrder = labOrder;
      $http.get('/api/getOrderTrackingDetail/'+labOrder.uuid).then(function(result2){
              if (!result2.error) {
                   $scope.labOrderDetail = result2.data[0];
                   // $scope.labOrderDateChecked == ($scope.labOrder.detail.lab_ordered_date != null);
                   // $scope.specimenCollectionDateChecked == ($scope.labOrder.detail.specimen_collection_date != null);
               }
      });

      $scope.updateLabResult = function(orderUUId){
          console.log(' i am trying to update lab results');
      }

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
                    $scope.orders = orderData.results;
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
                encounter   : $scope.patientInstance.hivEncounters[0].uuid,
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

