/**
 * Created by trungnguyen on 11/29/16.
 */
hivViralApp.factory('ngPatient', function($http, $location, $browser,$rootScope,$cookies) {

    //var rootUrl = 'http://localhost:8080/openmrs-standalone/';

    var globals = $cookies.getObject('globals');
    var url = globals.currentUser.links[0].uri;
        console.log('session id', globals.sessionId);
    var rootUrl = url.split('ws')[0];
    var patientService = {
        // getPatientDetail: function(patientUUID) {
        //     var querystr = patientUUID+'?v=full'+';jsessionId='+globals.sessionId;
        //     var service = 'ws/rest/v1/patient/';
        //     var urlResource = rootUrl+service+querystr;
        //     var promise = $http.get(urlResource).then(function (response1) {
        //         return response1.data;
        //     });
        //     // Return the promise to the controller
        //     return promise;
        // } ,
    //     getPatientList : function() {
    //     var querystr = '?v=default&limit=100'+';jsessionId='+globals.sessionId;
    //     var service = 'ws/rest/v1/visit';
    //     var urlResource = rootUrl+service+querystr;
    //     var promise = $http.get(urlResource).then(function (response) {
    //             console.log('patient list data ', response.data )
    //             return response.data;
    //         });
    //         // Return the promise to the controller
    //    return promise;
    // }
        getPatientList : function() {
            var promise = $http.get('/api/getPatientList').then(function (response) {
                return response.data;
            });
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
            var promise = $http.get('/api/getPatientAppointments/'+patientUUID).then(function(response){
                return response.data.results;
            })
            // Return the promise to the controller
            return promise;
        },
        // getEncounters : function(patientUUID) {
        //     var querystr = '?patient='+patientUUID+'&v=full&encounterType=d7151f82-c1f3-4152-a605-2f9ea7414a79';
        //     console.log(querystr);
        //     var service = 'ws/rest/v1/encounter';
        //     var urlResource = rootUrl+service+querystr+';jsessionId='+globals.sessionId;
        //     var promise = $http.get(urlResource).then(function(response){
        //
        //         return response.data.results;
        //     })
        //     // Return the promise to the controller
        //     return promise;
        // }
        getEncounters : function(patientUUID) {
            var promise = $http.get('/api/getPatientEncounters/'+patientUUID).then(function (response) {
         //       console.log(response.data);
                return response.data.results;
            });
            // Return the promise to the controller
            return promise;
        },
        getAllergies : function(patientUUID) {
            var promise = $http.get('/api/getPatientAllergies/'+patientUUID).then(function (response) {
                //       console.log(response.data);
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        getDrugs : function(patientUUID) {
            var promise = $http.get('/api/getPatientDrugs/'+patientUUID).then(function (response) {
                //       console.log(response.data);
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        getOrders : function(patientUUID) {
            var promise = $http.get('/api/getPatientOrders/'+patientUUID).then(function (response) {
                //       console.log(response.data);
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return patientService;
});