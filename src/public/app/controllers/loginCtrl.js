angular.module('app').controller('loginCtrl',function($rootScope,$scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window,$log,ngOpenMRSAuth,$cookies){
	$scope.identity = ngIdentity;

	if($scope.identity.isAuthenticated()) {
		$location.path('/');
	}
    $scope.login = function(username, password){
	    ngOpenMRSAuth.authenticateUser(username,password).then(function(success) {
            console.log('success ',success);
            if(success) {
                if(success.currentUser){
                    $rootScope.currentUser = success.currentUser;
                    $rootScope.identity = $cookies.getObject('globals');
          //          console.log($rootScope.currentUser);
                    $location.path('/');
                }
                // } else if ($scope.identity.currentUser.isLevelOne()) {  //Comment out admin route for now, until we decide if we need an admin role.
                // 	//TODO: admin route
                // }
                $("body").css("background-color", "#FFF;");
            } else {
                //$log.debug(success);
                ngNotifier.notifyError('Incorrect User Name/Password');
            }
        });

    };

	


});


