/**
 * Created by trungnguyen on 11/29/16.
 */

var db = require('../lib/dbConnection');
var paths = require('../config/config')
var restClient = require('node-rest-client').Client;

var client = new restClient();
var rootUrl = paths.openMrsPath;

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