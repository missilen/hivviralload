angular.module('app').factory('ngUser', function($resource) {
  var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });

  	UserResource.prototype.isLevelThree = function() {
		return this.roles && this.roles.levelThree;

	};

	UserResource.prototype.isLevelTwo = function() {
		return this.roles && this.roles.levelTwo;
	};

	UserResource.prototype.isLevelOne = function() {
		return this.roles && this.roles.levelOne;
	};

  return UserResource;
});