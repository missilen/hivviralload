angular.module('app').controller('previewReportCtrl', function($scope,$rootScope) {

$scope.chartImgUrls = [];
$scope.numberOfColumns = getCheckedColCounts();
$scope.sortedCols = getSortedColumns();

$scope.customizedData = JSON.parse(JSON.stringify($scope.eventData));
// console.log($scope.customizedData, 'customizedData');
// console.log($scope.customizedDoc, 'customizedDoc');
$scope.previewChartConfigs = JSON.parse(JSON.stringify($scope.customizedDoc.chartConfigs));

for (var i = 0 ; i < $scope.previewChartConfigs.length; i++){

  	if ($scope.customizedDoc.chartConfigs[i].checked) {
  	
  	    var chart = $scope.hiddenChartConfigs[i].getHighcharts();
  	    var chart_svg = chart.getSVG();                            
	    var canvas = document.getElementById('canvas');
	    // Get chart aspect ratio
	    var c_ar = chart.chartHeight / chart.chartWidth;

	    // Set canvas size
	     canvas.width = chart.chartWidth*2;
	     canvas.height = canvas.width*c_ar;
	     // canvas.width = 1200;
	     // canvas.height = 800;
	    
	    //canvg(canvas, chart_svg);
	    canvg(canvas, chart_svg, {
	        ignoreDimensions: true,
	        scaleWidth: canvas.width,
	        scaleHeight: canvas.height
	    });

	    $scope.chartImgUrls.push(canvas.toDataURL("image/png"));
	}
}


//$scope.previewColumns = $scope.previewGenerateColumnDefs();
$scope.filterSelected = function(items) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
        if ($scope.customizedDoc.checkedColumns.hasOwnProperty(items[i])) {
            if ($scope.customizedDoc.checkedColumns[items[i]].checked) {	
         	   result.push(items[i]);
        	}
        }
    }
    return result;
}

$scope.percentChanged = function(row,col) {
	var columnArry = $scope.sortedCols;
	var curIdx = columnArry.indexOf(col);
    var delta = 0;
    if ( curIdx > -1) { // col exist in array
 		if (curIdx  === 0) { // check if this is the first element
 		   // no percent change calculation	
 		}
 		else {
 			var previousValue =  row[columnArry[curIdx - 1]];
 			var currentValue = row[col];
 			if (currentValue == 0 || isNaN(currentValue) || isNaN(previousValue) ) {
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

$scope.print = function() {
	
	printElement(document.getElementById('printThis'));

	window.print();

}

function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    
    $printSection.innerHTML = "";
    
    $printSection.appendChild(domClone);
}

$scope.PrintContent=function()
{
var DocumentContainer = document.getElementById('printThis');
// console.log(DocumentContainer);
var WindowObject = window.open("", "PrintWindow",
"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
WindowObject.document.writeln(DocumentContainer.innerHTML);
WindowObject.document.write('<link rel="stylesheet" type="text/css" href="../css/custom.css">')
WindowObject.document.close();
WindowObject.focus();
WindowObject.print();
WindowObject.close();
}

function getCheckedColCounts() {
	var count = 0;
	for(col in $scope.customizedDoc.checkedColumns) {
		if ($scope.customizedDoc.checkedColumns[col].checked) {
			count++
		}
	}
 	return count
}

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
	////END GRID///

	function createPDFdefinition() {
		var customDoc = $scope.customizedDoc;
		var pdfDefinition = {
			footer: {text:'FIUO – For Internal Use Only', alignment: 'center'},
			content: [],
			styles: {
        header: {
          fontSize: 15,
          bold: true
        },
        subheader: {
        	fontSize: 12,
        	decoration: 'underline',
        	alignment: 'center'
        },
        category: {
        	fontSize: 14,
        	bold: true
        },
        topic: {
        	fontSize: 11,
        	decoration: 'underline',
        	bold: true
        },
        subtopic: {
        	fontSize: 11,
        	decoration: 'underline'
        },
        notes: {
        	fontSize: 10,
        	italics: true,
        	margin: [0,0,0,15]
        },
        table: {
        	margin: [0,5,0,0],
        	alignment: 'center'
        },
        image: {
        	margin: [0,5,0,15]
        },
        charts: {
        	margin: [0,5,0,15]
        },
        tableHeader: {
        	fillColor: '#c6d8ae'
        },
        tableHeaderTitle: {
        	fillColor: '#c6d8ae',
        	fontSize: 11,
        	bold: true,
        	alignment: 'center'
        },
        sectionTitle: {
        	bold: true,
        	fillColor: '#c6d8ae',
        	alignment: 'left'
        },
      },
      defaultStyle: {
      	fontSize: 10,
      	color: 'black'
      }
		};

		//Put together titles
		pdfDefinition.content.push({text:customDoc.reportMeta.title, style:'header', alignment: 'center'});
		pdfDefinition.content.push({text:customDoc.reportMeta.type, style:'header', alignment: 'center'});
		pdfDefinition.content.push({text:moment($scope.eventdoc.eventPublishDate).format('LL')+'\n\n', style: 'header', alignment: 'center'});

		//Put together table --TODO
		var selectedColumns = $scope.filterSelected($scope.sortedCols);


		var remainingColumns = ($scope.numberOfColumns+1)-2;
		var tableBodyArray = [];

		function addHeaderTitleArray() {
			var headerTitleArray = [
				{ text: '', rowSpan: 4, style: 'tableHeader' }, 
				{ text: 'Daily Metrics', style: 'tableHeaderTitle', colSpan: $scope.numberOfColumns}
			];
			for(var i = 0; i < remainingColumns; i++) {
				headerTitleArray.push({});
			}
			tableBodyArray.push(headerTitleArray);
		}	

		addHeaderTitleArray();

		function addCaveatArray() {
			var caveatArray = [{}];
			caveatArray.push({ text: 'Percent change from previous day is given in parentheses', style: 'tableHeader', colSpan:$scope.numberOfColumns, alignment: 'center', italics: true });
			for(var i = 0; i < remainingColumns; i++) {
				caveatArray.push({});
			}
			tableBodyArray.push(caveatArray);	
		}

		addCaveatArray();

		function addDayOfWeek() {
			var daysArray = [{}];
			for(var i = 0 ; i < selectedColumns.length; i++) {
				var date = parseInt(selectedColumns[i]);
				var formattedDay = moment(date).format('dddd');
			
				daysArray.push({text: formattedDay, style: 'tableHeader'});
			}
			tableBodyArray.push(daysArray);
		};

		addDayOfWeek();

		function addDate() {
			var dateArray = [{}];
			for (var i = 0; i < selectedColumns.length; i++) {
				var col = selectedColumns[i];
				dateArray.push({text: $scope.eventData.colDisplayNames[col], style: 'tableHeader'});
			}
			tableBodyArray.push(dateArray);
		};

		addDate();
		
		function addDataRows(){
			var gridData = $scope.customizedData.gridData;
			var allSectionDataArray = [];
			var sectionDataRows = [];

			for (var i = 0; i < gridData.length; i++) {
				var sectionTitle = [];
				if(gridData[i].checked == true) {
					sectionTitle.push({text: gridData[i].gridName, style: 'sectionTitle', colSpan: $scope.numberOfColumns+1});

					for(var j = 0; j < $scope.numberOfColumns; j++) {
						sectionTitle.push({});
					}
					allSectionDataArray.push(sectionTitle);
					var dailyData = gridData[i].dailyData;
					for(var n = 0; n < dailyData.length; n++) {
						sectionDataRows = [];
						var dataRow = [];
						dataRow.push({text: dailyData[n].label, alignment: 'left', margin: [0,5,0,0]});
				
						for(var m = 0; m < selectedColumns.length; m++) {
							var index = selectedColumns[m];
							var percentChanged = $scope.percentChanged(dailyData[n], index);
							dataRow.push({text:dailyData[n][index] + '\n'+ percentChanged});
						}
						sectionDataRows.push(dataRow);
						// console.log(sectionDataRows);
						for(var a = 0; a < sectionDataRows.length; a++){
							allSectionDataArray.push(sectionDataRows[a]);
						}
					}

					// allSectionDataArray.push(sectionDataRows);
				}
			}
			for (var k = 0; k < allSectionDataArray.length; k++) {
				tableBodyArray.push(allSectionDataArray[k]);
			}
		};

		addDataRows();

		var tableObj = {
			style: 'table',
			color: '#444',
			table: {
					widths: [ 175, '*', '*','*','*','*' ],
					headerRows: 4,
					body: tableBodyArray
			}
		};

		pdfDefinition.content.push(tableObj); 
		pdfDefinition.content.push({text: '\nNotes: '+customDoc.docData[0].sectionData.notes, style: 'notes'});
		//Pull in charts --TODO
		function addCharts() {
			var chartsRaw = $scope.chartImgUrls;
			var width = 450;
			for(var i = 0; i < chartsRaw.length; i++) {
				pdfDefinition.content.push({image: chartsRaw[i], width: width, alignment: 'center', style: 'charts'})
			}
			pdfDefinition.content.push({text: '\nNotes: '+customDoc.docData[1].sectionData.notes, style: 'notes'});
		}

		addCharts();

		//Pull in images 
		function addImages() {
			var images = customDoc.docData[2].sectionData.doc;
			// console.log(images);
			var width = 450;
			var imagesArray = [];
			for(var i = 0; i < images.length; i++) {
				if(images[i].checked === true) {
					if(images[i].imageWidth > 500) {
						pdfDefinition.content.push({image: 'data:image/png;base64,'+images[i].base64, width: width, alignment: 'center', style:'image'});
						// console.log('should happen one time');
					} else {
						pdfDefinition.content.push({image: 'data:image/png;base64,'+images[i].base64, style:'image'});
					}
					
				}
			}
			pdfDefinition.content.push({text: '\nNotes: '+customDoc.docData[2].sectionData.notes, style: 'notes'});
		}

		addImages();
		
		//Put together 'Media Summaries' Section
		pdfDefinition.content.push({text:customDoc.docData[3].sectionName+'\n\n', style: 'subheader'});
		var mediaSummaries = customDoc.docData[3].sectionData.doc.categories;
		for(var i = 0; i < mediaSummaries.length; i++) {
			var topics = mediaSummaries[i].topics;
			if(mediaSummaries[i].checked === true){
				pdfDefinition.content.push({text:mediaSummaries[i].name, style: 'category'});

				for(var j = 0; j < topics.length; j++) {
					if(topics[j].checked === true) {
						pdfDefinition.content.push({text:'\n'+topics[j].name+'\n\n', style: 'topic'});
						var bullets = topics[j].bullets;
						var bulletsArray = [];
						for(var k = 0; k < bullets.length; k++) {
							if(bullets[k].checked === true) {
								var sbullets = bullets[k].subBullets;
								var sbulletsArray = [];
								for(var h = 0; h < sbullets.length; h++) {
									if(sbullets[h].checked === true) {
										sbulletsArray.push(sbullets[h].name);
									}
								}
								bulletsArray.push(bullets[k].name);
								bulletsArray.push({ul:sbulletsArray});
							}
						}
						pdfDefinition.content.push({ul:bulletsArray});
						var subtopics = topics[j].subTopics;
						for(var l = 0; l < subtopics.length; l++){
							if(subtopics[l].checked === true) {
								pdfDefinition.content.push({text:'\n'+subtopics[l].name+'\n', style: 'subtopic'});
								var stBullets = subtopics[l].bullets;
								var stBulletsArray = [];
								for(var m =0; m < stBullets.length; m++) {
									var stSubBullets = stBullets[m].subBullets;
									var stSubBulletsArray = [];
									if(stBullets[m].checked === true) {
										for(var n = 0; n < stSubBullets.length; n++) {
											if(stSubBullets[n].checked === true) {
												stSubBulletsArray.push(stSubBullets[n].name);
											}
										}
										stBulletsArray.push(stBullets[m].name);
										stBulletsArray.push({ul:stSubBulletsArray});
									}
								}

							}
							pdfDefinition.content.push({ul: stBulletsArray});
						}
						
					}
				}
			}
		}
		pdfDefinition.content.push({text: '\nNotes: '+customDoc.docData[3].sectionData.notes, style: 'notes'});
		//End Media Summaries Section

		return pdfDefinition;
	}

  $scope.makePDF = function() {
  	var customDoc = $scope.customizedDoc;
    var docDefinition = {};
    docDefinition =  createPDFdefinition();

    pdfMake.createPdf(docDefinition).download($scope.customizedData.eventName+'.pdf');
    // pdfMake.createPdf(docDefinition).open();
  };

});

