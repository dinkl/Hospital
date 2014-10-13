"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('usuarioCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
  		var currentUser = Parse.User.current();
        $scope.username=currentUser.get('username')
        $scope.email=currentUser.get('email')
	}]);
})