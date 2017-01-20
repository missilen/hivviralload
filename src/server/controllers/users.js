var User = require('mongoose').model('User'),
  encrypt = require('../utilities/encryption');
var mongo = require('../lib/mongoConnection_notuse');

exports.getUsers = function(req, res) {
  User.find({}).exec(function(err, collection) {
    res.send(collection);
  });
};

exports.createUser = function(req, res) {
  var userData = req.body;
  userData.email = userData.email.toLowerCase();
  userData.salt = encrypt.createSalt();
  userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
  userData.roles = [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: true}];
  userData.displayName = userData.firstName +' '+ userData.lastName;

  User.create(userData, function(err, user) {
    if(err) {
      if(err.toString().indexOf('E11000') > -1) {
        err = new Error('Duplicate Username');
      }
      res.status(400);
      return res.send({reason:err.toString()});
    }
    // req.logIn(user, function(err) {
    //   if(err) {return next(err);}
    //   res.send(user);
    // });
    res.send(user);
  });
};

exports.removeUser =  function(req,res) {
  var userData = req.body;
  console.log(req.body);
  User.remove({_id:userData._id}, function(err) {
    if(err) {
      res.send(err);
    } else {
      res.send({success:true});
    }
  });
}


exports.updateRole =  function(req,res) {
  var userDoc = req.body;
  var Id = userDoc._id;

  User.findByIdAndUpdate(Id, {$set: {roles:userDoc.roles}}, function(err,result) {
      if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });

}

