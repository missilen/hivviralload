/**
 * Created by trungnguyen on 11/28/16.
 */
angular.module('app').controller('homeController',function($scope,$http,$state,$stateParams,$location,ngPatient,$window,$uibModal) {
    // var vm = this;
    // vm.items;
    // vm.resourseName = 'class';
    // vm.params = {includeAll:true};
    // openmrsRest.listFull(vm.resourseName,vm.params).then(function(response){
    //     vm.items = response.results;
    // })

    // set default sort column and direction;
    $scope.sortReverse=false;
    $scope.sortType = "patientId";
// set up pagination
    $scope.totalPatients = 0;
    $scope.itemsPerPage = 15;
    $scope.currentPage = 1;
    $scope.currentSession = ngPatient.getSession();
    if (!$scope.currentSession) {
        $window.href  = $location.$$absUrl.split('owa')[0];
    }
    //$scope.patientList = ngPatient.getPatientList();
    ngPatient.getPatientList().then(function(res){
        if (res.results){
                $scope.patientList = [];
                var uniquePatients = _.uniq(res.results, function(x){
                    return x.patient.display;
            });

                uniquePatients.forEach(function(patient) {
                    ngPatient.getPatientDetail(patient.patient.uuid).then(function(patientResult){

                        $scope.patientList.push({
                            patientId: patientResult.display.split('-')[0].trim(),
                            name: patientResult.display.split('-')[1].trim(),
                            birthDate: patientResult.person.birthdate,
                            uuid: patientResult.uuid,
                            identifiers: patientResult.identifiers,
                            links: patientResult.links
                        })
                    })

                })
      //          console.log($scope.patientList);
            $scope.totalPatients = $scope.patientList.length;
            }
    })

    $scope.sortPatient = function(sortType) {
        if($scope.sortReverse)
        {
            $scope.patientList.sort(compareAsc);
        }
        else
        {
            $scope.patientList.sort(compareDesc);
        }

    }

    function compareAsc(a,b) {
        if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
                return -1;
            if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
                return 1;
            return 0;
    }

    function compareDesc(a,b) {


            if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
                return -1;
            if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
                return 1;
            return 0;

    }

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

    $scope.showPatient = function(uuid) {
        // function to activate "modal"
        ngPatient.getPatientDetail(uuid).then(function(res) {
            $scope.myPatient = res;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/patient/modalPatientDetail.html',
                controller: patientModalInstanceCtrl,
                size: 'sm',
                resolve : {
                    myPatient : function() {
                        return $scope.myPatient
                    }
                }
            });
            // var modalInstance = $uibModal.open({
            //     animation: true,
            //     ariaLabelledBy: 'modal-title',
            //     ariaDescribedBy: 'modal-body',
            //     templateUrl: 'app/patient/modalPatientDetail.html',
            //     controller: 'patientModalInstanceCtrl',
            //     size: 'lg',
            //     // resolve: {
            //     //     patient: function () {
            //     //         return $scope.myPatient;
            //     //     }
            //     // }
            // })

        });

    };



    var patientModalInstanceCtrl = function (myPatient, $uibModalInstance,$scope) {
        $scope.myPatient = myPatient;
        console.log($scope.myPatient);

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.test

    };

});