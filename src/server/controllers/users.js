var User = require('mongoose').model('User'),
  encrypt = require('../utilities/encryption');
var mongo = require('../lib/mongoConnection');

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

exports.getAnalysts = function(req, res) {
  var collection = mongo.mongodb.collection('users');
  collection.find({roles:{ $elemMatch:{id:"levelThree", enabled: true}}},{'salt':0, 'hashed_pwd':0}).toArray(function(err,doc) {
    if(err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
};

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

// exports.updateUser = function(req, res) {
//   var userUpdates = req.body;

//   if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
//     res.status(403);
//     return res.end();
//   }

//   req.user.firstName = userUpdates.firstName;
//   req.user.lastName = userUpdates.lastName;
//   req.user.username = userUpdates.username;
//   if(userUpdates.password && userUpdates.password.length > 0) {
//     req.user.sale = encrypt.createSalt();
//     req.user.hashed_pwd = encrypt.hashPwd(req.user.sale, userUpdates.password);
//   }
//   req.user.save(function(err) {
//     if(err) { res.status(400); return res.send({reason:err.toString()});}
//     res.send(req.user);
//   });
// };