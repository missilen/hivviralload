/// <reference path="../../../typings/angularjs/angular.d.ts"/>
// custom search filter for active dashboard
hivViralApp.filter('searchOrders', function($filter) {
  return function(orderList,searchText) {
    var searchRegx = new RegExp(searchText, "i");
    if (searchText == undefined || searchText == ''){
        return orderList;
    }
    var result = [];
    if (orderList) {
    for(i = 0; i < orderList.length; i++) {
            if ((orderList[i].order_id==null?false:orderList[i].order_id.toString().search(searchRegx) !== -1) ||
                (orderList[i].specimen_name == null? false: orderList[i].specimen_name.toString().search(searchRegx) !== -1) ||
                $filter('date')(new Date(orderList[i].lab_ordered_date),'MM/dd/yyyy').search(searchRegx) != -1)
                {
            result.push(orderList[i]);
            }
        }
    }
    return result;
  }
  
  });