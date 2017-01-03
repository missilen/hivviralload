var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String, unique:true},
  provider: String,
  salt: String,
  hashed_pwd: String,
  roles: [],
  displayName: String
});

userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
  
  User.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'tsavel');
      User.create({firstName:'Tom',lastName:'Savel',email:'tsavel@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Tom Savel',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'kta');
      User.create({firstName:'Michael',lastName:'Ta',email:'kta@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Michael Ta',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'tnguyen');
      User.create({firstName:'Trung',lastName:'Nguyen',email:'tnguyen@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Trung Nguyen',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'sdavid');
      User.create({firstName:'Sanjith',lastName:'David',email:'sdavid@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Sanjith David',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'kxiong');
      User.create({firstName:'KB',lastName:'Xiong',email:'kxiong@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'KB Xiong',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);}
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'sanalyst');
      User.create({firstName:'Scott',lastName:'Analyst',email:'sanalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: true},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Scott Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'janalyst');
      User.create({firstName:'Joe',lastName:'Analyst',email:'janalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: true},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Joe Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'danalyst');
      User.create({firstName:'Dan',lastName:'Analyst',email:'danalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: true},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Dan Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'ranalyst');
      User.create({firstName:'Rob',lastName:'Analyst',email:'ranalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: true},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Rob Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'lanalyst');
      User.create({firstName:'Lisa',lastName:'Analyst',email:'lanalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: false},
    {id:'levelThree', name: 'Analyst', enabled: true},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Lisa Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'klubell');
      User.create({firstName:'Keri',lastName:'Lubell',email:'klubell@cdc.gov',salt:salt, hashed_pwd: hash, roles: [{id:'levelOne', name:'Admin', enabled: false},
    {id:'levelTwo', name:'Coordinator', enabled: true},
    {id:'levelThree', name: 'Analyst', enabled: false},
    {id:'disabled', name: 'Disabled', enabled: false}],displayName:'Keri Lubell',provider:'local'},function(err, docs) {
        if (err){ console.log(err);} 
        else
        {//console.log(docs); 
        }
      });
    }
  });
};

exports.createDefaultUsers = createDefaultUsers;