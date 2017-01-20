var hivViralApp = angular.module('app', [
  'ngRoute'
  // ,'ui.router'
  ,'ngResource'
  ,'ngAnimate'
  ,'ngSanitize'
  ,'LocalStorageModule'
  ,'ui.bootstrap'
  ,'isteven-multi-select'
  ,'ui.bootstrap.datetimepicker'
  ,'highcharts-ng'
  ,'ngFileUpload'
  ,'naif.base64'
  ,'base64'
  ,'ngCookies'
  //,'chart.js'
  //,'tc.chartjs'
  //,'googlechart'
  // ,'chieffancypants.loadingBar'
  // ,'angulartics'
  // ,'angulartics.google.analytics'
]);

//Role checking for routes
// var routeRoleChecks = {
//   levelThree:{auth: function(ngAuth){
//             return ngAuth.authorizeCurrentUserForRoute('levelThree')
//           }},
//   levelTwo:{auth:function(ngAuth){
//     return ngAuth.authorizeCurrentUserForRoute('levelTwo')
//           }},
//   levelOne:{auth:function(ngAuth){
//     return ngAuth.authorizeCurrentUserForRoute('levelOne')
//           }},
//   levelTwoOrThree:{auth:function(ngAuth){
//     return ngAuth.authorizeCurrentUserForRoute('levelTwoOrThree')
//   }}
// };


//to prevent IE caching
hivViralApp.config(['$httpProvider','$logProvider', function ($httpProvider,$logProvider) {
         $logProvider.debugEnabled(false);
        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }
]);

hivViralApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
    when('/dashboard', {
        templateUrl : '/partials/patientDashboard',
        controller  : 'dashCtrl'
    }).
    when('/dashboard/tasks', {
        templateUrl : '/partials/tasks',
        controller  : 'tasksCtrl'
    }).
    when('/dashboard/reports', {
        templateUrl : '/partials/reports',
        controller  : 'reportsCtrl'
    }).
    // when('/admin', {
    //     templateUrl: '/partials/admin',
    //     controller: 'adminCtrl',
    //     resolve: routeRoleChecks.levelTwo
    // }).
    when('/login', {
        templateUrl : '/partials/login',
        controller  : 'loginCtrl'
    }).
    otherwise({
        redirectTo: '/dashboard'
      });

    //$locationProvider.html5Mode(true);
}]);


// hivViralApp.config(['$stateProvider', '$urlRouterProvider',
//     function($stateProvider, $urlRouterProvider) {
//         $urlRouterProvider.otherwise('/dashboard');
//         $stateProvider
//             .state('dashboard', {
//                 url:'/',
//                 templateUrl : '/partials/patientDashboard',
//                controller  : 'dashCtrl',
//             })
//             .state('patientList',{
//                 url : '/patientList',
//                 templateUrl : '/partials/patientDashboard',
//                 controller  : 'dashCtrl',
//             })
//             .state('tasks',{
//                 url : '/tasks',
//                 templateUrl  : 'app/tasks/tasks.html',
//                 controller   : 'tasksController'
//             })
//             .state('reports', {
//                 url : '/reports',
//                 templateUrl  : 'app/reports/reports.html',
//                 controller   : 'reportsController'
//             })
//             .state('patientDetail', {
//                 url:'/patientDetail/:uuid',
//                 views : {
//                     '' :  {
//                         templateUrl  : 'app/patient/patientDetail.html',
//                         controller   : 'patientController'
//                     },
//                     'diagnoses@patientDetail' : {
//                         templateUrl : 'app/patient/diagnoses.html',
//                         controller  : 'diagnosesCtrl'
//                     },
//                     'appointments@patientDetail' : {
//                         templateUrl : 'app/patient/appointments.html',
//                         controller    : 'appointmentsCtrl'
//                     },
//                     'flowsheets@patientDetail' : {
//                         templateUrl : 'app/patient/flowsheets.html',
//                         controller    : 'flowsheetsCtrl'
//                     },
//                     'allergies@patientDetail' : {
//                         templateUrl : 'app/patient/allergies.html',
//                         controller    : 'allergiesCtrl'
//                     },
//                     'notes@patientDetail' : {
//                         templateUrl : 'app/patient/notes.html',
//                         controller    : 'notesCtrl'
//                     },
//                     'contacts@patientDetail' : {
//                         templateUrl : 'app/patient/contacts.html',
//                         controller    : 'contactsCtrl'
//                     },
//                     'medications@patientDetail' : {
//                         templateUrl : 'app/patient/medications.html',
//                         controller    : 'medicationsCtrl'
//                     }
//                 }
//
//             })
//
//     }]);
angular.module('app').run(function($rootScope,$location) {
  $rootScope.$on('$routeChangeError', function(evt,current, previous,rejection) {
    if(rejection === 'not authorized'){
      $location.path('/login');
    }
  })
})