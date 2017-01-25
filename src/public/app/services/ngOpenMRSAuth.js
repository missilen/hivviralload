/**
 * Created by trungnguyen on 12/5/16.
 */
angular.module('app').factory('ngOpenMRSAuth', function($location, $http, $base64,$q,$cookies,$rootScope) {
    return {
        authenticateUser : authenticateUser,
        logout          : logout
    }

    function logout() {
        clearCredentials();
        $rootScope.$broadcast('onUserLoggedOut');
        return true;
    }

    function authenticateUser(username, password) {
        var dfd = $q.defer();
        $http.post('/openmrslogin', {username:username, password:password}).then(function(response) {
      //      console.log('login response ', response);
            if(response.data.success) {
                try {
                    delete response.data.authenticateData.user.privileges;

                }
                catch (e) {
                    // donothing here
                    //console.log(e);
                };
                try {
                    delete response.data.authenticateData.user.roles;
                }
                catch (e) {
                    // donothing here
                    //console.log(e);
                };
                var globals =  {
                    currentUser: response.data.authenticateData.user,
                    sessionId : response.data.authenticateData.sessionId,
                    authenticated : response.data.authenticateData.authenticated,
                    systemId      : response.data.authenticateData.systemId
                };
                $rootScope.globals = globals;
                $cookies.putObject('globals', globals);
                dfd.resolve(globals);
            } else {
                dfd.resolve(false);
            }
        });
        return dfd.promise;
    }



    function clearCredentials() {
        //clear user credentials
        $http.defaults.headers.common.Authorization = 'Basic';
    }

})