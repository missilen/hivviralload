hivViralApp.controller('rootCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngAuth','$location','ngIdentity','$route','$log','$http','$cookies','ngOpenMRSAuth','ngNotifier', function($scope, $rootScope, $modal,$routeParams,ngAuth, $location, ngIdentity,$route,$log,$http,$cookies,ngOpenMRSAuth,ngNotifier) {

$("#wrapper").show();

$scope.searchText='';
//$scope.identity = $cookies.getObject('globals');

if ($rootScope.identity)  {
        if($rootScope.identity.currentUser === undefined){  //changed background color based on authenticated or not
            $("body").css("background-color", "#2a2d33;");
            $location.path( "/login" );
        }
        else
        {
            $("body").css("background-color", "#f7f7f7;");
            //$scope.roleTypes="";
        }
    }
    else {
        $location.path( "/login" );
    }


    $scope.updateLabResults = function(labOrder){
        $scope.labOrder = labOrder;
        var modalInstance = $modal.open({
            templateUrl: '/partials/resultEntryModal',
            controller: resultEntryModalCtrl,
            scope: $scope,
            size: 'md',
            keyboard: true,
            backdrop: 'static',
            resolve : {
                labOrder: function () {
                    return $scope.labOrder;
                }
            }
        });
        modalInstance.result.then(function () {
          $route.reload();
        }, function () {

        });



    };

    var resultEntryModalCtrl = function ($scope, $modalInstance) {
        //console.log($scope.labOrder);
        //$scope.labResultsData.preparerId = $scope.labOrder.specimen_collection_by;
        //$scope.labResultsData.specimen_collection_date = $scope.labOrder.specimen_collection_date;

        $scope.updateLabOrder = function() {
            //  console.log($scope.patientInstance);
            var labResultData = {
                specimen_collected_by  : $scope.labResultsData.preparerId  || 1,
                specimen_collection_date : $scope.labResultsData.preparedTimestamp,
                lab_processed_by  : $scope.labResultsData.testerId  || 1,
                lab_processed_date  : $scope.labResultsData.processedTimestamp,
                lab_results          : $scope.labResultsData.results,

            };
            var postingData = {
                openmrs_order : $scope.labOrder.openmrs_order,
                opemmrs_order_uuid : $scope.labOrder.openmrs_order_uuid,
                labResultData : labResultData
            };
            //    console.log('update lab order called ', labResultData);
            $http.post('/api/updateLabOrderResults',postingData).then(function(updateOrderResult){

                if (updateOrderResult.data.success) {
                    // confirm order has been created with an order number
                    ngNotifier.notify("Lab Order Results Updated successful.");
                    $modalInstance.close('updated');
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



$scope.logout = function(){
            $cookies.remove('globals');
            $scope.identity = null;
            ngOpenMRSAuth.logout()
            $location.path('/login')
            $("body").css("background-color", "#2a2d33;");

      }

}]);


