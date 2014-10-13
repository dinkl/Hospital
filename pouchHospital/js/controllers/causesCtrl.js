"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('causesCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
        $scope.causes=$rootScope.causesFull
       
	}]);
})