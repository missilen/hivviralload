angular.module('app').controller('adminCtrl', function($scope, $log, ngNotifier, $http, ngUser,$route,$modal) {
	$scope.eventTypeValue = {};
	$scope.categoryValue = {};

	$scope.users = ngUser.query();

	$http.get('/api/eventTypes').then(function(res) {
		$scope.eventListDoc = res.data[0];
		if ($scope.eventListDoc == undefined) {  //default
			$scope.eventListDoc = {
				eventTypeList: [{
					'name': 'Current Types',
					eventTypes: []
				}]
			};
		}
	});
	
	$http.get('/api/categories').then(function(res) {
		$scope.categoryListDoc = res.data[0];
		//console.log($scope.categoryListDoc);
		if ($scope.categoryListDoc == undefined) { //default
			$scope.categoryListDoc = {
				categoryList:
				[{
					categories: []
				}]
			};
		}
	});

	$scope.outputRoles = [];

	$scope.removeUser =  function(user) {
		var answer = confirm('Are you sure you want to delete this user?');
	    if (answer) {
	    	$http.post('/api/users/remove', user).then(function(res) {
	    		//console.log(user);
	    		if (res.data.success) {
	    			ngNotifier.notify('You have deleted a user');
	    		} else {
	    			ngNotifier.notifyError('Error deleteing user');
	    		}
	    	});
	    	$route.reload();
	    } 
	}

	$scope.updateRole = function(user) {
		$http.put('/api/users', user).then(function(res) {
			ngNotifier.notify('User\'s role has been updated!');
		});
		//console.log(user);
	};

	$scope.saveEventTypes = function() {
		$http.post('/api/eventTypes', $scope.eventListDoc).then(function(res) {
			console.log(res.data.success);
			// if (res.data.success) {
   //              console.log(res.data);
   //            } else {
   //              alert('there was an error');
   //            }
		});
	};

	$scope.addEvent = function(eventTypeList, e) {
		//$log.debug(eventTypeList);
		var eventTypeName = $scope.eventTypeValue[eventTypeList.name];
		if (eventTypeName.length > 0) {
			eventTypeList.eventTypes.push({name:eventTypeName});
		}
		console.log(eventTypeName);
		ngNotifier.notify("Event types list has been updated!");
		$scope.eventTypeValue = {};
		e.preventDefault();
	};

	$scope.editEvent = function(eventType) {
		$log.debug(eventType);
		eventType.editing = true;
		console.log(eventType.editing);
	};

	$scope.cancelEditingEvent = function(eventType) {
		eventType.editing = false;
	};

	$scope.saveEvent = function(eventType, e) {
		// topic.save();
		eventType.editing = false;
		ngNotifier.notify("Event types list has been updated!");
		e.preventDefault();
	};

	$scope.removeEvent = function(eventTypeList, event) {
		var index = eventTypeList.eventTypes.indexOf(event);
		if (index > -1) {
			eventTypeList.eventTypes.splice(index, 1)[0];
			ngNotifier.notify("Event types list has been updated!");
		}
	};

	$scope.saveCategoryList = function() {
		$http.post('/api/categories', $scope.categoryListDoc).then(function(res) {
			console.log(res.data.success);
			if (res.data.success) {
                $log.debug(res.data);
              } else {
                alert('there was an error');
              }
		});
	};



	$scope.addCategory = function(categoryList, e) {
		//$log.debug(eventTypeList);
		var categoryName = $scope.categoryValue[categoryList.name];
		if (categoryName.length > 0) {
			categoryList.categories.push({name:categoryName,
										userAssigned: "",
										statusCompleted: false,
										dateCompleted: "",
										topics:[]
			});
		}
		ngNotifier.notify("Category list has been updated!");

		$scope.categoryValue = {};
		e.preventDefault();
	};

	$scope.editCategory = function(category) {
		$log.debug(category);
		category.editing = true;
		console.log(category.editing);
	};

	$scope.cancelEditingCategory = function(category) {
		category.editing = false;
	};

	$scope.saveCategory = function(category, e) {
		// topic.save();
		category.editing = false;
		ngNotifier.notify("Category list has been updated!");
		e.preventDefault();
	};

	$scope.removeCategory = function(categoryList, category) {
		var index = categoryList.categories.indexOf(category);
		if (index > -1) {
			categoryList.categories.splice(index, 1)[0];
			ngNotifier.notify("Category list has been updated!");
		}
	};

	$scope.addUser = function() {
		var modalInstance = $modal.open({
			scope: $scope,
			templateUrl: '/partials/addUserModal',
			controller: createUserModalInstanceCtrl,
			windowClass: 'center-modal',
			size: 'md'
		});
	};

	var createUserModalInstanceCtrl = function($scope, $modalInstance) {
		$scope.ok = function() {
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	};

});