angular.module('app').factory('ngIdentity', function($window, ngUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new ngUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      if (role == 'levelThree') {
        return !!this.currentUser && this.currentUser.roles[2].enabled;
      }
      if (role == 'levelTwo') {
        return !!this.currentUser && this.currentUser.roles[1].enabled;
      }
      if (role == 'levelOne') {
        return !!this.currentUser && this.currentUser.roles[0].enabled;
      }
      if (role == 'levelTwoOrThree') {
        return !!this.currentUser && (this.currentUser.roles[2].enabled || this.currentUser.roles[1].enabled);
      }
    },
    getRoleName: function() {
      for(role in this.currentUser.roles) {
        if(this.currentUser.roles[role].enabled) {
          return this.currentUser.roles[role].name;
        }
      }
    }
  }
})