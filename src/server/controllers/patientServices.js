/**
 * Created by trungnguyen on 11/29/16.
 */




var db = require('../lib/dbConnection');
var paths = require('../config/config')
var restClient = require('node-rest-client').Client;

var client = new restClient();
var rootUrl = paths.openmrsPath;
var openmrsuser = 'Admin' ;
var openmrspassword = 'Admin123';
exports.getCareSettings = function(req,res) {
    var currentSession = req.session;
    console.log('current sessesion ',currentSession);
    var service = 'ws/rest/v1/caresetting';
    var urlResource = rootUrl+service;
    client.get(urlResource, function(data,response){
        if (data.error.code === "org.openmrs.aop.AuthorizationAdvice:116") {

        }
        console.log(data);
      //  console.log(response);
       res.send(data);
    })
};
exports.getPatientList = function(req,res) {
    var globals = JSON.parse(req.cookies.globals);
    var currentSession = req.session;
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    //var querystr = '?v=default&limit=100'+';jsessionId='+globals.sessionId;
    var querystr = '?v=default&limit=100';
    var service = 'ws/rest/v1/visit';
    var urlResource = rootUrl+service+querystr;
    var patientList =[];
    var count = 0;
    client.get(urlResource, function(data,response){
        //  console.log(response);
        var service = 'ws/rest/v1/patient/';
       // console.log(data.results);
        for(var i=0; i < data.results.length; i++) {
            visitData = data.results[i];
            var querystr = data.results[i].patient.uuid+'?v=full';
            var urlResource = rootUrl+service+querystr;
            client.get(urlResource, function(detaildata){
                count++;
                patientList.push({
                  'visit' : visitData,
                  'patientDetail' : detaildata
                });
                if (count == data.results.length) {
                //    console.log(patientList);
                    res.send(patientList);
                }
            });
        }
    })
};

exports.getPatientDetail = function(req,res) {
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    //var querystr = '?v=default&limit=100'+';jsessionId='+globals.sessionId;
    var querystr = req+'?v=full';
    var service = 'ws/rest/v1/patient/';
    var urlResource = rootUrl+service+querystr;
    client.get(urlResource, function(data,response){
        //  console.log(response);
        res.send(data);
    })
};

exports.getPatientEncounters = function(req,res) {
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    var querystr = '?patient='+req.params.patientUuid+'&v=full&encounterType=d7151f82-c1f3-4152-a605-2f9ea7414a79';
    var service = 'ws/rest/v1/encounter';
    var urlResource = rootUrl+service+querystr;
    //console.log(urlResource)
    client.get(urlResource, function(data,response){
      //  console.log(data);
        res.send(data);
    })
}

exports.getPatientAllergies = function(req,res) {
    var options_auth = { user: openmrsuser, password: openmrspassword };
    var client = new restClient(options_auth);
    var querystr = req.params.patientUuid+'/allergy';
    var service = 'ws/rest/v1/patient/';
    var urlResource = rootUrl+service+querystr;
    //console.log(urlResource)
    client.get(urlResource, function(data,response){
        if (data.error) {
            res.send({'error': data.error.code});
        }
        else {
            res.send(data);
        }
    })
}

exports.getLabOrders = function(req,res) {
    // this function retrieve all lab orders
};
exports.showLabOrderForm = function(req, res){

}

// function getPatientDetail(patientUUID) {
//     var querystr = patientUUID+'?v=full'+';jsessionId='+globals.sessionId;
//     var service = 'ws/rest/v1/patient/';
//     var urlResource = rootUrl+service+querystr;
//     var promise = $http.get(urlResource).then(function (response1) {
//         return response1.data;
//     });
//     // Return the promise to the controller
//     return promise;
// }