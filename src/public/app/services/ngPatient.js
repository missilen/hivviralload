/**
 * Created by trungnguyen on 11/29/16.
 */
hivViralApp.factory('ngPatient', function($http, $location, $browser,$rootScope,$cookies) {

    //var rootUrl = 'http://localhost:8080/openmrs-standalone/';
    var globals = JSON.parse($cookies.get('globals'));
    var url = globals.currentUser.links[0].uri;

    var rootUrl = url.split('ws')[0];
    var patientService = {
        getPatientDetail: function(patientUUID) {
            var querystr = patientUUID+'?v=full'+';jsessionid='+globals.sessionid;
            var service = 'ws/rest/v1/patient/';
            var urlResource = rootUrl+service+querystr;
            var promise = $http.get(urlResource).then(function (response1) {
                return response1.data;
            });
            // Return the promise to the controller
            return promise;
        } ,
        getPatientList : function() {
        var querystr = '?v=default&limit=100'+';jsessionid='+globals.sessionid;
        var service = 'ws/rest/v1/visit';
        var urlResource = rootUrl+service+querystr;
        var promise = $http.get(urlResource).then(function (response) {
                return response.data;
            });
            // Return the promise to the controller
       return promise;
    }
        ,getSession : function() {
            var service = 'ws/rest/v1/session';
            var urlResource = rootUrl+service;
            var promise = $http.get(urlResource).then(function(result){
                return result.data;
            })
            // Return the promise to the controller
            return promise;
        }
        ,getCareSettings : function() {
            var service = 'ws/rest/v1/caresetting';
            var urlResource = rootUrl+service;
            var promise = $http.get(urlResource).then(function(response){
                return response.data.results;
            })
            // Return the promise to the controller
            return promise;
        }
        ,getAppointments : function(patientUUID){
            var service = 'ws/rest/v1/caresetting';
            var urlResource = rootUrl+service;
            var promise = $http.get(urlResource).then(function(response){
                return response.data.results;
            })
            // Return the promise to the controller
            return promise;
        },
        getEncounters : function(patientUUID) {
            var querystr = '?patient='+patientUUID+'&v=full&encounterType=d7151f82-c1f3-4152-a605-2f9ea7414a79';
            console.log(querystr);
            var service = 'ws/rest/v1/encounter';
            var urlResource = rootUrl+service+querystr;
            var promise = $http.get(urlResource).then(function(response){

                return response.data.results;
            })
            // Return the promise to the controller
            return promise;
        }
    };
    return patientService;
});