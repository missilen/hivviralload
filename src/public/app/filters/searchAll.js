/// <reference path="../../../typings/angularjs/angular.d.ts"/>
// custom search filter for active dashboard
hivViralApp.filter('searchAll', function($filter) {
  return function(patientList,searchText) {
    var searchRegx = new RegExp(searchText, "i");
    if (searchText == undefined || searchText == ''){
        return patientList;
    }
    var result = [];
    if (patientList) {
    for(i = 0; i < patientList.length; i++) {
            if ((patientList[i].patientId==null?false:patientList[i].patientId.toString().search(searchRegx) !== -1) ||
                (patientList[i].name == null? false: patientList[i].name.toString().search(searchRegx) !== -1) ||
                $filter('date')(new Date(patientList[i].birthDate),'MM/dd/yyyy').search(searchRegx) != -1)
                {
            result.push(patientList[i]);
            }
        }
    }
    return result;
  }
  
  });