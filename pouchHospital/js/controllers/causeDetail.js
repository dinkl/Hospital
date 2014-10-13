"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('causeDetailCtrl', ['$scope','$rootScope','$routeParams', function($scope,$rootScope,$routeParams) {
  		var causeId=$routeParams.number;
        for(var i in $rootScope.causesFull){
            if(causeId==$rootScope.causesFull[i].NUMERO)
                $scope.cause=$rootScope.causesFull[i]
        }
        $scope.minimized=false;
        $scope.splitCIE10=($scope.cause.CIE10).split("\n")
        $scope.splitCIE9=($scope.cause.CIE9).split("\n")
        $scope.splitNormatividad=($scope.cause.NORMATIVIDAD).split("\n")
        $scope.splitAuxiliares=($scope.cause.AUXILIARES).split("\n")
        $scope.splitCIE10=($scope.cause.CIE10).split("\n")
        var list=$scope.cause.MEDICAMENTOS;
        var tempList=list.split("\n");
        $.getJSON("js/json/medicamentos.json",function(data){
           $scope.medicamentos=[]
            for (var d in data){
                if(tempList.indexOf(data[d].clave)!=-1)
                    $scope.medicamentos.push(data[d])
            }
            $scope.$apply();
            
        })
        //var cause=$rootScope.causesFull
       
	}]);
})