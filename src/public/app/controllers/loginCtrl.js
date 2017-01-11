angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window,$log,ngOpenMRSAuth){
	$scope.identity = ngIdentity;
	
	if($scope.identity.isAuthenticated()) {
		$location.path('/');
	}
    $scope.login = function(username, password){
	    ngOpenMRSAuth.authenticateUser(username,password).then(function(success) {
         //   console.log('success ',success);
            if(success) {
                if(success.currentUser){
                    ngIdentity.currentUser = success.currentUser;
                    console.log(ngIdentity.currentUser);
                    $location.path('/dashboard');
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


