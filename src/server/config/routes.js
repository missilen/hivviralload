//references to controllers go here
var index = require('../controllers/index');
var users = require('../controllers/users');

var admin = require('../controllers/admin');
var reports = require('../controllers/reports');
// var multer = require('multer');
var media = require('../controllers/media');
var fs = require('fs');
//var auth = require('./auth');
var openmrsAuth = require('./openMRSAuth');
var patientServices = require('../controllers/patientServices');
var orderTracking = require('../controllers/orderTracking');

var mongoose = require('mongoose'),
    User = mongoose.model('User');



module.exports = function(app) {

  app.get('/api/users', users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateRole);
  app.post('/api/users/remove', users.removeUser);

  app.post('/api/fileUpload', media.uploadFile);
  app.get('/api/fileUpload/:id', media.getFile);
  app.post('/api/fileUpload/delete', media.deleteFile);
  app.post('/api/fileUpload/update', media.updateFileChecked);

app.get('/api/getShipmentVendors', orderTracking.getShipmentVendors);
app.get('/api/getLabVendors', orderTracking.getLabVendors);
  app.get('/api/getPatientList',patientServices.getPatientList);
  app.get('/api/getPatientEncounters/:patientUUID',patientServices.getPatientEncounters);
  app.get('/api/getPatientAllergies/:patientUUID',patientServices.getPatientAllergies);
  app.get('/api/getPatientOrders/:patientUUID',patientServices.getPatientOrders);
  app.get('/api/getLocalOrders/:patientUUID',orderTracking.getLocalOrders);
  app.get('/api/getPatientDrugs/:patientUUID',patientServices.getPatientDrugs);
  app.get('/api/getPatientAppointments/:patientUUID',patientServices.getPatientAppointments);
  app.get('/api/getOpenmrsOrderDetail/:orderUUID',patientServices.getOrderDetail);
  app.get('/api/getOrderTrackingDetail/:orderUUID',orderTracking.getOrderTrackingDetail);
  app.post('/api/creatLabOrder', orderTracking.createLabOrder);
  app.post('/api/updateLabOrderResults', orderTracking.updateLabOrderResults);

  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  // app.post('/login', auth.authenticate);
  app.post('/openmrslogin',openmrsAuth.authenticateUser);
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  //catchall for everything not defined above
  app.get('/*', index.index);
}