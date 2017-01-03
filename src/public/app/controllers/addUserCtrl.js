angular.module('app').controller('addUserCtrl', function($scope,$location,$http,ngUser,ngAuth, ngNotifier,$route) {
	
	$scope.addUser = function() {
		var newUserData = {
			email: $scope.email,
			password: $scope.password,
			firstName: $scope.firstName,
			lastName: $scope.lastName,
		};

		$http.post('/api/users', newUserData).then(function(res) {
			if (res.err){
				console.log(res.err);
				ngNotifier.notifyError('There was an error in saving the new user');
			} else {
				ngNotifier.notify('New user as has been added!')
			}
		});
		$route.reload();
		$scope.ok();
	}
});