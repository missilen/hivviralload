var paths = require('../config/config');
var restClient = require('node-rest-client').Client;

var rootUrl = paths.openmrsPath;


exports.authenticateUser = function(req, res, next) {
 // console.log('req body',req.body);
  var options_auth = {
      user: req.body.username,
      password:req.body.password,
      mimetypes: {
          json: ["application/json", "application/json;charset=utf-8"],
          xml: ["application/xml", "application/xml;charset=utf-8"]
      }
  };
  var client = new restClient(options_auth);
    var service = 'ws/rest/v1/session';
    var urlResource = rootUrl+service;
    client.get(urlResource, function (data,response){
        if (data.error) {
            res.send({success:false})
        }
        else {

            console.log('returned data ', data);

            if (data.authenticated) {
                data.systemId = rootUrl.split('http://')[1].split('/')[0];
                res.send({success: true, authenticateData: data})
            }
            else {
                res.send({success: false, authenticateData: data})
            }
        }

    });

};

exports.requiresApiLogin = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresRole = function() {
  return function(req, res, next) {
    console.log(req.user.roles);
    if(!req.isAuthenticated() || !req.user.roles.levelTwo === true) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  }
}

