/* global angular */
angular.module('app').factory('ngAuth', function($http, ngIdentity, $q, ngUser) {
  return {
    authenticateUser: function(username, password) {
      var dfd = $q.defer();
      $http.post('/login', {username:username, password:password}).then(function(response) {
        if(response.data.success) {
          var user = new ngUser();
          angular.extend(user, response.data.user);
          ngIdentity.currentUser = user;
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },

    // createUser: function(newUserData) {
    //   var newUser = new ngUser(newUserData);
    //   var dfd = $q.defer();

    //   newUser.$save().then(function() {
    //     dfd.resolve();
    //   }, function(response) {
    //     dfd.reject(response.data.reason);
    //   });

    //   return dfd.promise;
    // },
// Not needed now
//    updateCurrentUser: function(newUserData) {
//      var dfd = $q.defer();
//
//      var clone = angular.copy(ngIdentity.currentUser);
//      angular.extend(clone, newUserData);
//      clone.$update().then(function() {
//        ngIdentity.currentUser = clone;
//        dfd.resolve();
//      }, function(response) {
//        dfd.reject(response.data.reason);
//      });
//      return dfd.promise;
//    },

    logoutUser: function() {
      var dfd = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        ngIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function(role) {
      if(ngIdentity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }

    },
    authorizeAuthenticatedUserForRoute: function() {
      if(ngIdentity.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    }
  }
});