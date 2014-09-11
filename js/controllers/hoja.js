"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('hojaCtrl', ['$scope', function($scope) {
  		$scope.greeting = 'Hola!';
	}]);
})