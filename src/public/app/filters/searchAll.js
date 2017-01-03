/// <reference path="../../../typings/angularjs/angular.d.ts"/>
// custom search filter for active dashboard
commSphereApp.filter('searchAll', function($filter) {
  return function(instances,searchText) {
    var searchRegx = new RegExp(searchText, "i");
    if (searchText == undefined || searchText == ''){
        return instances;
    }
    var result = [];
    if (instances) {
    for(i = 0; i < instances.length; i++) {
            if ((instances[i].eventName==null?false:instances[i].eventName.toString().search(searchRegx) !== -1) ||
                (instances[i].eventInstanceId==null?false:instances[i].eventInstanceId.toString().search(searchRegx) !== -1) ||
                (instances[i].eventType == null? false: instances[i].eventType.toString().search(searchRegx) !== -1) ||
                (instances[i].userCreated.displayName ==null?false:instances[i].userCreated.displayName.toString().search(searchRegx) !== -1) ||
                (instances[i].eventInstanceStatus == null?false:instances[i].eventInstanceStatus.toString().search(searchRegx) !== -1) ||
                $filter('date')(new Date(instances[i].dateCreated),'MM/dd/yyyy').search(searchRegx) != -1)
                {
            result.push(instances[i]);
            }
        }
    }
    return result;
  }
  
  });