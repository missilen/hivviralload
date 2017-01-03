//references to controllers go here
var index = require('../controllers/index');
var users = require('../controllers/users');
var events = require('../controllers/events');
var dashboardData = require('../controllers/dashboardData');
var admin = require('../controllers/admin');
var reports = require('../controllers/reports');
// var multer = require('multer');
var media = require('../controllers/media');
var fs = require('fs');
var auth = require('./auth');
var mongoose = require('mongoose'),
    User = mongoose.model('User');



module.exports = function(app) {

  app.get('/api/users', users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateRole);
  app.get('/api/users/analysts', users.getAnalysts);
  app.post('/api/users/remove', users.removeUser);

  app.post('/api/fileUpload', media.uploadFile);
  app.get('/api/fileUpload/:id', media.getFile);
  app.post('/api/fileUpload/delete', media.deleteFile);
  app.post('/api/fileUpload/update', media.updateFileChecked);

  app.post('/api/events', events.saveEvent);
  app.post('/api/events/drafts',events.saveDraft);
  app.get('/api/events/id/:id',dashboardData.getEventById);
  app.get('/api/events/:status',dashboardData.getEvents);
  app.get('/api/events/getAvailEventId/:partialId',events.getAvailEventInstanceId);
  app.get('/api/events/getEventInstanceInfo/:Id',dashboardData.getEventInstanceInfo);
  app.get('/api/events/duplicate/:eventName',events.findDuplicate);
  app.post('/api/events/drafts/delete/:Id',events.deleteDraft);
  app.post('/api/events/active/delete/:Id',events.deActivateInstance);
  app.get('/api/events/analyst/:analystId',events.getEventsByAnalyst);
  app.post('/api/events/saveEventCategory',events.saveEventCategory);
  app.get('/api/events/getEventsForImport',events.getEventsForImport);
  app.get('/api/events/findDuplicateId/:eventId',events.findDuplicateId);
  app.get('/api/getNextAutoId/',events.getNextAutoId);
  app.get('/api/events/data/:id',events.getDataById);
 
  app.post('/api/events/saveCollectedData',events.saveCollectedData);
  app.post('/api/events/saveChartData',events.saveChartData);

  app.post('/api/reports/saveCustomizedReport', reports.saveCustomizedReport);
  app.get('/api/reports/getCustomizedReport/:eventDocId', reports.getCustomizedReport);

  app.get('/api/eventTypes', admin.getEventTypes);
  app.post('/api/eventTypes', admin.updateEventTypes);
  app.get('/api/categories', admin.getCategories);
  app.post('/api/categories', admin.updateCategories);

  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  app.post('/login', auth.authenticate);

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