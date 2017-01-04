app.controller('mainCtrl', ['$scope', '$rootScope','$uibModal','$state','$stateParams','$location','$log','$http','$window','ngPatient','authentication', function($scope, $rootScope, $modal,$state,$stateParams,$location,$log,$http,$window,ngPatient,authentication) {
    authentication.getCurrentSession().then(function(session){
        $scope.currentSession = session;
        console.log($scope.currentSession);
        if (!$scope.currentSession) {
            $window.href  = $location.$$absUrl.split('owa')[0];
        }
        else {
            $rootScope.continueNav = true;
            $("#wrapper").show();
        }
    })


    $scope.activeMenu = '';
    $scope.searchText = '';
    $scope.currentUser = 'Tom Savel';
    $scope.careSettings = {};
    ngPatient.getCareSettings().then(function (results) {
        results.forEach(function(item) {
            $scope.careSettings[item.display] = item;
        })
    });
   // console.log($scope.careSettings);

}]);

    var importEventModalCtrl = function ($scope, $modalInstance, $location, $state, $timeout, $http, $filter, $modal) {
// display modal popup to show list of available events
        $scope.sortReverse = false;
        $scope.sortType = "dateCreated";

//setup pagination here
        $scope.totalPatients = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;

        $http.get('/api/events/getEventsForImport').then(function (res) {
            if (res.data) {
                $scope.instances = res.data;
                //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'');
                $scope.totalPatients = $scope.instances.length;
                $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
                $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
                //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'').slice(beginItem,endItem);
                $scope.sortInstances();
            } else {
                alert('no data received');
            }
        });





        $scope.ok = function () {
            $modalInstance.close();
            $state.reload()
           // $route.reload();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
            $state.reload()
          //  $route.reload();
        };
        $scope.pageCount = function () {
            return Math.ceil($scope.totalPatients / $scope.itemsPerPage);
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function (searchText) {
            $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
            $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
            //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,searchText).slice(beginItem,endItem);
        };

        $scope.sortInstances = function (sortType) {
            if ($scope.sortReverse) {
                $scope.instances.sort(compareAsc);
            }
            else {
                $scope.instances.sort(compareDesc);
            }

        }

        function compareAsc(a, b) {
            if ($scope.sortType == "coordinatorAssign") {
                if ((a.userCreated.displayName).toString().toLowerCase() < (b.userCreated.displayName).toString().toLowerCase())
                    return -1;
                if ((a.userCreated.displayName).toString().toLowerCase() > (b.userCreated.displayName).toString().toLowerCase())
                    return 1;
                return 0;
            }
            else {
                if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
                    return -1;
                if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
                    return 1;
                return 0;
            }
        }

        function compareDesc(a, b) {
            if ($scope.sortType == "coordinatorAssign") {
                if ((a.userCreated.displayName).toString().toLowerCase() > (b.userCreated.displayName).toString().toLowerCase())
                    return -1;
                if ((a.userCreated.displayName).toString().toLowerCase() < (b.userCreated.displayName).toString().toLowerCase())
                    return 1;
                return 0;
            }
            else {
                if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
                    return -1;
                if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
                    return 1;
                return 0;
            }
        }







    };



