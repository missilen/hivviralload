/**
 * Created by trungnguyen on 12/5/16.
 */
angular.module('app').factory('ngOpenMRSAuth', function($location, $http, $base64,$q,$cookies) {
    return {
        authenticateUser : authenticateUser,
        logout          : logout
    }

    function logout() {
        return true;
    }

    function authenticateUser(username, password) {
        var dfd = $q.defer();
        $http.post('/openmrslogin', {username:username, password:password}).then(function(response) {
            console.log('login response ', response);
            if(response.data.success) {
                delete response.data.authenticateData.user.privileges;
                delete response.data.authenticateData.user.roles;
                var globals =  {
                    currentUser: response.data.authenticateData.user,
                    sessionId : response.data.authenticateData.sessionId,
                    authenticated : response.data.authenticateData.authenticated
                };
                $cookies.putObject('globals', globals);
                dfd.resolve(globals);
            } else {
                dfd.resolve(false);
            }
        });
        return dfd.promise;
    }

})