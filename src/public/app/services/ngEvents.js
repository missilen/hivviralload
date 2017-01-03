angular.module('app').factory('ngEvents', function($http) {
  var eventService = {
    getEvents: function(draftStatus) {
      var promise = $http.get('/api/events/'+ draftStatus).then(function (response) {
        // The then function here is an opportunity to modify the response
   //     console.log('parm in factory ' + eventStatus);
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  return eventService;
}); 