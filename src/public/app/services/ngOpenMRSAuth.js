/**
 * Created by trungnguyen on 12/5/16.
 */
angular.module('app').factory('ngOpenMRSAuth', function($location, $http, $rootScope, $base64,$q,ngIdentity,ngUser) {
    return {
        authenticateUser : authenticateUser(currentUser),
        isAuthenticated : isAuthenticated,
        logout          : logout
    }

    var url = $location.$$absUrl;
    var rootUrl = url.split('owa')[0];

    function setAuthorizationHeader(username,password) {
        $http.defaults.headers.common.Authorization = 'Basic ' + base64.encode(username + ':' + password);
    }

    function logout() {
        return false;
    }

    function isAuthenticated() {
        return true;
    }
    function authenticateUser (username,password) {

        var service = 'ws/rest/v1/session';
        var urlResource = rootUrl+service;
        setAuthorizationHeader(username,password);
        var promise = $http.get(urlResource).then(function (response) {
            return response.data;
        });
    }

    function authenticateUser(username, password) {
        var dfd = $q.defer();
        $http.post('/openMRSlogin', {username:username, password:password}).then(function(response) {
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
    }

})