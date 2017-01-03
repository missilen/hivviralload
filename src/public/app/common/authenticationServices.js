/**
 * Created by trungnguyen on 12/5/16.
 */
hivViralApp.factory('authentication', function($location, $http, $rootScope, $base64) {
    var paths = require('./server/config/config');
    console.log(paths);
    var url = $location.$$absUrl;
    var rootUrl = url.split('owa')[0];
    var currentUser = {
        username : 'Admin',
        password : 'Admin123'
    }
    var authenticationServices = {
        login : login,
        getCurrentSession: function() {
        var service = 'ws/rest/v1/session';
            var urlResource = rootUrl+service;
            login(currentUser);
            var promise = $http.get(urlResource).then(function (response) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        } ,

       login : function() {
            session.then(function(response){
                $rootScope.session = response;
                console.log($rootScope);
            });
        }
    }
    return authenticationServices;

    function login(currentUser) {
        $http.defaults.headers.common.Authorization = 'Basic ' + base64.encode(CurrentUser.username + ':' + CurrentUser.password);
    }
})