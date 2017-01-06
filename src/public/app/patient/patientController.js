/**
 * Created by trungnguyen on 11/28/16.
 */
angular.module('app').controller('patientController',function($rootScope, $scope,$http,$state,$stateParams,$location,ngPatient,$uibModal) {
    $scope.myPatient;
    var patientuuid = $stateParams.uuid;
    var orderer;
    ngPatient.getPatientDetail(patientuuid).then(function(res) {
            $scope.myPatient = res;
        $scope.$broadcast('currentPatient', {
            myPatient:  $scope.myPatient
        });
    });

    $scope.currentUserRoles = $scope.$parent.currentSession.user.roles;
    orderer = $scope.currentUserRoles[0].uuid;
    for (var i=0; i< $scope.currentUserRoles.length; i++) {
        if ($scope.currentUserRoles[i].display === 'Provider') {
                orderer = $scope.currentUserRoles[i].uuid;
                break;
            }
    }




    $scope.showLabOrderForm = function(uuid, orderType){
        var modalInstance = $uibModal.open({
            scope : $scope,
            animation: true,
            templateUrl: 'hivViralApp/forms/labOrderFormModal.html',
            controller: labOrderInstanceCtrl,
            size: 'sm',
            resolve: {
            patient: function () {
                return $scope.myPatient;
            }
        }
        });
        var orderTemplate = {
            "type": orderType,
            "patient": patientuuid,
            "concept": "129473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "encounter": "8a32e7cb-0bbb-4c4e-8ed4-fc982443859f",
            "orderer": orderer,
            "careSetting": $scope.$parent.careSettings.Outpatient.uuid

        }
        console.log(orderTemplate);


    }

    var labOrderInstanceCtrl = function (patient,$scope,$uibModalInstance) {
        $scope.patient = patient;
        console.log($scope.patient);
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    };


});