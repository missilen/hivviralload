angular.module('app').controller('customizeReportCtrl', function($scope, $rootScope, $modal, $http) {
	$rootScope.combinedGrid = [];
	$scope.haveChecked = 0;
	$scope.checkedLimit = 5;
	$scope.displayColumnLimit = 3;
	$scope.numberOfColumns = Object.keys($scope.eventData.colDisplayNames).length;
  $rootScope.hiddenChartConfigs = [];

	//determine how many columns have been checked on load
	for(obj in $scope.customizedDoc.checkedColumns){
		if($scope.customizedDoc.checkedColumns[obj].checked){
			$scope.haveChecked++;
		}
	}

	//console.log("Onload Checked ", $scope.haveChecked);
$scope.sortedCols = getSortedColumns();

	var gridData = $scope.eventData.gridData;
  	// console.log($scope.eventData);
	// for(var i = 0; i < $scope.eventData.gridData.length; i++) {
	// 	//console.log($scope.eventData.gridData[i]);
	// 	$scope.combinedGrid.push({'gridSectionName':$scope.eventData.gridData[i].gridName, 'dailyData': $scope.eventData.gridData[i].dailyData});
	// }
	// console.log($scope.combinedGrid);
 
  $scope.buildCustomizedHighChartConfig = function(grid,index) {
    // console.log($scope.chartDefaultConfig.yAxis);
     var chartData = $scope.getChartData(grid);
     //console.log($scope.customizedDoc.chartConfigs);
     
     if ($scope.customizedDoc.chartConfigs[index] != undefined) {
          $scope.customizedDoc.chartConfigs[index].title.text = grid.gridName;
          $scope.customizedDoc.chartConfigs[index].series = chartData.series;
          $scope.customizedDoc.chartConfigs[index].xAxis.categories = chartData.xAxis;
     }
     else {
          $scope.customizedDoc.chartConfigs[index] =      
          {
            options: {
              chart: {
                  type: angular.copy($scope.chartDefaultConfig.chartType),
              }
            },
            series: chartData.series,
            title: {
                      text: grid.gridName,
                      style: {
                                fontWeight: undefined,
                                fontSize  : 26
                             }

            },
            xAxis: { 
                      title : angular.copy($scope.chartDefaultConfig.xAxis.title), 
            categories: chartData.xAxis
             },
            yAxis:[],          
                loading: false
            }
            for(i=0; i < chartData.series.length; i ++) {
              var oneYaxis = {
                  title: angular.copy($scope.chartDefaultConfig.yAxis.title), 
                  //type: "logarithmic",
                  type : "linear",
                  showEmpty : false
                  // opposite  : function(){
                  //              return !(i%2 == 0)
                  //            }
              }
              $scope.customizedDoc.chartConfigs[index].yAxis.push(oneYaxis);
          }
     }
     //return customizedDoc.chartConfig;   
     //console.log($scope.customizedDoc.chartConfigs);   
  };
	
  $scope.addYaxis = function(chartIndex,yAxisId, serieId,side) {
    var oneYaxis = {
                  title: $scope.chartDefaultConfig.yAxis.title, 
                  //type: "logarithmic",
                  type : "linear",
                  opposite : function() { if (side == 'right') {
                                                 return true
                                             } else {
                                                 return false;
                                             }
                                         }
                                       }
        $scope.highChartConfig[chartIndex].yAxis.push(oneYaxis);
        $scope.highChartConfig[chartIndex].series[serieId].yAxis = yAxisId;
  }
	for(var i = 0; i < gridData.length; i++) {
		//console.log(gridData[i].gridName);
		$rootScope.combinedGrid.push({"label":gridData[i].gridName});
  	for(var j = 0; j < gridData[i].dailyData.length; j++) {
			//console.log(gridData[i].dailyData[j]);
			$rootScope.combinedGrid.push(gridData[i].dailyData[j]);
		}
    // build charts data here
    //$scope.highChartConfig[i] = $scope.buildHighChartData(gridData[i],i);
    //$scope.buildCustomizedHighChartConfig(gridData[i],i);
	}
	//console.log($rootScope.combinedGrid);
  $rootScope.hiddenChartConfigs = JSON.parse(JSON.stringify($scope.customizedDoc.chartConfigs));
  for (var i = 0; i < $scope.hiddenChartConfigs.length; i++) {
      $rootScope.hiddenChartConfigs[i].options.chart.height = 400;
      $rootScope.hiddenChartConfigs[i].options.chart.width = 600;
  }

  
  $scope.myRowTemplate =   '<div ng-class="{\'ui-grid-row\':true}"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

  function rowTemplate() {
    return $timeout(function() {
      $scope.waiting = 'Done!';
      $interval.cancel(sec);
      $scope.wait = '';
      return '<div ng-class="{ \'report-grid-header\': grid.appScope.rowFormatter( row ) }">' +
                 '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                 '</div>';
    }, 6000);
  }

   $scope.rowFormatter = function( row ) {
    console.log(row);
    return true;
  };

	var customizeHeaderCellTemplate = 
	  '<div ng-class="{ \'sortable\': sortable }">'+
	  '<div class="ui-grid-vertical-bar"> </div>'+
	  '<div col-index="renderIndex" ng-mouseenter="hoverTopic = true" ng-mouseleave="hoverTopic = false" class="ui-grid-cell-contents" style="text-align:center;">'+
	  '  <input type="checkbox" ng-click="$event.stopPropagation(); grid.appScope.checkGridColumn(col.name, col.checked); " ng-model="col.checked"/>&nbsp;{{ col.displayName CUSTOM_FILTERS }}<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }"></span>'+
	  '</div>'+
	  '<div ng-if="grid.options.enableColumnMenus &amp;&amp; !col.isRowHeader &amp;&amp; col.colDef.enableColumnMenu !== false" ng-click="toggleMenu($event)" class="ui-grid-column-menu-button"><i class="ui-grid-icon-angle-down"> </i></div>'+
	  '<div ng-if="filterable" ng-repeat="colFilter in col.filters" class="ui-grid-filter-container">'+
	  '  <input type="text" ng-model="colFilter.term" ng-click="$event.stopPropagation()" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" class="ui-grid-filter-input"/>'+
	  '  <div ng-click="colFilter.term = null" class="ui-grid-filter-button"><i ng-show="!!colFilter.term" class="ui-grid-icon-cancel right"> </i>'+
	  '    <!-- use !! because angular interprets \'f\' as false-->'+
	  '  </div>'+
	  '</div>'+
	  '</div>'


  var customizedCellTemplate = 
  '<div class="ui-grid-cell-contents">'+
  '<div style="text-align:center;" class="uiCellText">{{COL_FIELD}}</div>'+
  '</div>'
          

 $scope.checkGridColumn = function(column,checked) {
 	console.log($rootScope.checkedColumns);
 	// console.log(Object.keys($scope.columnsList).length);
 	// if(Object.keys($scope.columnsList).length) {

 	// }
 	
 	// if(checked) {
 	// 	console.log($rootScope.checkedColumns.length);
 	// 	if($rootScope.checkedColumns.length < 5) {
 	// 		$rootScope.checkedColumns.push(column);
 	// 	} else {
 	// 		alert('You may only select a maximum of five columns.');
 	// 	}
 	// } else {
 	// 	if($rootScope.checkedColumns.length > 0) {
 	// 		toDelete = $rootScope.checkedColumns.indexOf(column);
 	// 		if(toDelete != -1) {
 	// 			$rootScope.checkedColumns.splice(toDelete, 1);
 	// 		}
 	// 	}
 	// }

 	// console.log($rootScope.checkedColumns);
 	
 };



	//console.log(currentChecked);
$scope.checkChanged = function(col){

	// console.log(col);
	
    if(col.checked){
    	$scope.haveChecked++;
    } else {
    	$scope.haveChecked--;
    }
    // console.log($scope.haveChecked);
}

$scope.getCustomizedTableHeight = function(grid, id) {
	var rowHeight = 30; // your row height
	var headerHeight = 30; // your header height
	if (id.split('_')[1] === '0') {
		return {
			height: (($scope.combinedGrid.length + 1) * rowHeight + headerHeight - 12) + "px"
		};
	} else {
		return {
			height: ($scope.combinedGrid.length * rowHeight + headerHeight - 14) + "px"
		};
	}
};


$scope.customizeGenerateColumnDefs= function() {
   var columnArry = [];
   var columnLayout = [];
   // pick a grid to iterate
   var oneGrid =  $scope.eventData.gridData[0];
   if (oneGrid) {  // at least one grid exist
       for (var columnName in oneGrid.dailyData[0]) {
          if (oneGrid.dailyData[0].hasOwnProperty(columnName)) {
            if (columnName !== '$$hashKey' && columnName != 'label')  {
                columnArry.push(columnName);
            } 
          }
       }

    }
    else {
        $scope.addDataColumn('label');
       // columnArry.push('label');
        $scope.addDataColumn(''+$scope.eventdoc.dateCreated)
        columnArry.push(''+$scope.eventdoc.dateCreated);
    }
       columnArry.sort();
       columnArry.unshift('label');
       for(i=0; i< columnArry.length; i++) {
      // build columns defition object
         if (columnArry[i] === 'label') {
              oneColumnDef = {'field': columnArry[i], 'displayName':$scope.eventData.colDisplayNames[columnArry[i]] , enableSorting:false, minWidth: $scope.minTopicWidth,pinnedLeft:true,enableColumnMenu:false
          }
        }
         else {
            //var formattedDate = $filter('date')(columnArry[i],'mediumDate');
            oneColumnDef = {'field': columnArry[i], 'displayName' : $scope.eventData.colDisplayNames[columnArry[i]], enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false
            //,headerCellTemplate: '/partials/customHeaderCellTemplate'
            ,headerCellTemplate: customizeHeaderCellTemplate
            ,cellTemplate: customizedCellTemplate 
          }
         }
            columnLayout.push(oneColumnDef);
       }
      // console.log(columnLayout)
       return columnLayout;
     
};

$scope.customizeColumns = $scope.customizeGenerateColumnDefs();


// $scope.filterLabel = function(items) {
    
//     var result = {};
//     angular.forEach(items, function(value,key) {
//         //console.log(key,' ',value)
//         if (key != 'label') {
//             result[key] = value;
//         }
//     });
//     return result;
//}

function getSortedColumns() {

   var columnArry = [];
   // pick a grid to iterate
   var cols =  $scope.eventData.colDisplayNames;
   if (cols) {  // at least one grid exist
       for (var columnName in cols ) {
          if (cols.hasOwnProperty(columnName)) {
            if (columnName !== '$$hashKey' && columnName != 'label')  {
                columnArry.push(columnName);
            } 
          }
       }

    }
    columnArry.sort();
    return columnArry;
}

$scope.options = {
accept: function(sourceNode, destNodes, destIndex) {
  var data = sourceNode.$modelValue;
  var destType = destNodes.$element.attr('data-type');
  return (data.type == destType); // only accept the same type
},
dropped: function(event) {
  

},
beforeDrop: function(event) {
  // if (!window.confirm('Are you sure you want to drop it here?')) {
  //   event.source.nodeScope.$$apply = false;
  // }
}
};


$scope.percentChanged = function(row,col) {
  var columnArry = $scope.sortedCols;
  //  // pick a grid to iterate
  //   var oneGrid =  $scope.eventData.gridData[0];
  //   if (oneGrid) {  // at least one grid exist
  //      for (var columnName in oneGrid.dailyData[0]) {
  //         if (oneGrid.dailyData[0].hasOwnProperty(columnName)) {
  //           if (columnName !== '$$hashKey' && columnName != 'label')  {
  //               columnArry.push(columnName);
  //           } 
  //         }
  //      }
  //      columnArry.sort();

  //   }
    var curIdx = columnArry.indexOf(col);
    var delta = 0;
    if ( curIdx > -1) { // col exist in array
    if (curIdx  === 0) { // check if this is the first element
       // no percent change calculation 
    }
    else {
      var previousValue =  row[columnArry[curIdx - 1]];
      var currentValue = row[col];
      if (currentValue == 0 || isNaN(currentValue) || isNaN(previousValue)) {
         delta = -1;
      }
      else {
      delta = Math.floor((currentValue - previousValue) / currentValue *100);
      }
    }
  }
  if (delta > 0) {
    return '(+'+delta+'%)';
  }
  else if(delta ==0) {
    return '(nc%)';
  }
  else if(delta == -1){
    return ' '
  }
  else {
    return '('+delta+'%)';
  }
}

});
