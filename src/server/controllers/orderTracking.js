/**
 * Created by trungnguyen on 12/28/16.
 */
var db = require('../lib/dbConnection');
var paths = require('../config/config')
var restClient = require('node-rest-client').Client;

exports.getShipmentVendors = function(req,res) {
    //connection.connect();
    console.log('im here');
    if(true){
        db.query('SELECT * FROM shipment_vendor',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(caseData);
                    }
                catch(e) {
                    res.send('shipment vendors not found or problem with query');
                    }
            }
         });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

};

exports.getLabVendors = function(req,res) {
    //connection.connect();
    if(true){
        db.query('SELECT * FROM lab_vendor',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(caseData);
                }
                catch(e) {
                    res.send('lab vendors not found or problem with query');
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

}

exports.updateLabOrder = function(req,res) {
    //connection.connect();
    if(true){
        db.query('SELECT * FROM shipment_vendor',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                try {
                    res.send(caseData);
                }
                catch(e) {
                    res.send('case not found or problem with query');
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();

}
exports.getSession = function(req,res) {
    console.log('i was in get session');
    var client = new restClient();
    var rootUrl = paths.openMrsPath;
    var service = 'ws/rest/v1/session';
    var urlResource = rootUrl+service;
    console.log(urlResource);
    client.get(urlResource, function(data,response){
        console.log(data);
        // raw response
     //   console.log(response);
        res.send(data);
    })


};