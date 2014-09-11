"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('listaPacientesCtrl', ['$scope', function($scope) {
  		$scope.greeting = 'Hola!';
	}]);
})