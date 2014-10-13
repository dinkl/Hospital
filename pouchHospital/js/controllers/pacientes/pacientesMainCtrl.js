"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('pacientesMainCtrl', ['$scope','$rootScope','$routeParams', function($scope,$rootScope,$routeParams) {
		    $scope.init=function(){
		     $scope.activeCtrl="lista";
		     $scope.paciente={};

		     if($routeParams.section){$scope.activeCtrl=$routeParams.section;}
		      else $scope.activeCtrl="lista";
		    } 	

		    //WATCH SCOPES
		     $rootScope.$watch("pacienteActivo",function(newVal,oldVal){
		     	if(newVal){
		     			$scope.paciente=newVal;
		     			}
		     })
			$scope.init();     
	}]);
})