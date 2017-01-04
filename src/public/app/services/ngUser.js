angular.module('app').factory('ngUser', function($resource) {
  var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });

  	UserResource.prototype.isLevelThree = function() {
		//return this.roles && this.roles[2].enabled;
       return true;
	};

	UserResource.prototype.isLevelTwo = function() {
		//return this.roles && this.roles[1].enabled;
		return false;
	};

	UserResource.prototype.isLevelOne = function() {
	//	return this.roles && this.roles[0].enabled;
		return false;
	};

  return UserResource;
});