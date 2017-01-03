/**
 * Created by trungnguyen on 12/14/16.
 */
angular.module('app').controller('diagnosesCtrl',function($scope,$http,$state,$stateParams,$location,ngPatient,$window,$uibModal) {
    $scope.encounters;
    $scope.diagnoses = [];
    $scope.combinedObs = [];
    $scope.$on('currentPatient', function (event, data) {
        console.log(data.myPatient.uuid);
        ngPatient.getEncounters(data.   myPatient.uuid).then(function (encounterData) {
                encounterData.forEach(function (encounter) {
                    encounter.obs.forEach(function(ob){
                        if (ob.concept.uuid === '159947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
                            ob.groupMembers.forEach(function(member) {
                                 if (member.concept.uuid === "1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"){
                                     var oneDiagnose = {
                                         'encounterDatetime': encounter.encounterDatetime,
                                         'location': encounter.location,
                                         'ob': ob,
                                         'display' : member.display.split('PROBLEM LIST:')[1],
                                         'links': ob.links
                                 }
                                     $scope.diagnoses.push(oneDiagnose);
                                 }
                            })

                        }
                    })
            })
            console.log($scope.diagnoses);
        })

    });

});