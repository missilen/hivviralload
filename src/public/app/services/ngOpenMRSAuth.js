/**
 * Created by trungnguyen on 12/5/16.
 */
angular.module('app').factory('ngOpenMRSAuth', function($location, $http, $rootScope, $base64,$q,ngIdentity,ngUser,$cookies) {
    return {
        authenticateUser : authenticateUser,
        logout          : logout
    }

    function logout() {
        return false;
    }

    // function authenticateUser (username,password) {
    //     var dfd = $q.defer();
    //     // var url = $location.$$absUrl;
    //     //var rootUrl = url.split('owa')[0];
    //     var rootUrl = "http://localhost:8081/openmrs-standalone/"
    //     var service = 'ws/rest/v1/session';
    //     var urlResource = rootUrl+service;
    //     setAuthorizationHeader(username,password);
    //     $http.get(urlResource).then(function (response) {
    //         if (response.data){
    //             dfd.resolve(response.data);
    //     }
    //         else {
    //             dfd.resolve(false);
    //         }
    //     });
    //     return dfd.promise;
    // }

    function authenticateUser(username, password) {
        var dfd = $q.defer();

        $http.post('/openmrslogin', {username:username, password:password}).then(function(response) {
            if(response.data.success) {
                var user = new ngUser();
                angular.extend(user, response.data.authenticateData.user);
                ngIdentity.currentUser = user;
                ngIdentity.isAuthenticated();
                $rootScope.globals = {
                    currentUser: user,
                    sessionId : response.data.authenticateData.sessionId,
                    authenticated : response.data.authenticateData.authenticated
                };
                $cookies.putObject('globals', $rootScope.globals);
                dfd.resolve(true);
            } else {
                dfd.resolve(false);
            }
        });
        return dfd.promise;
    }

})