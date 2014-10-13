"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('loginCtrl', ['$scope','$rootScope', '$routeParams', function($scope,$rootScope,$routeParams) {
        
        if($routeParams.mensaje!=null){
            $scope.error=true
        }

        $scope.checkUser=function(){
            Parse.User.logIn($scope.user, $scope.password, {
              success: function(user) {
                $rootScope.currentUser=user
                location.hash="/"
              },
              error: function(user, error) {
                location.hash="login/error"
              }
            });
        }
	}]);
})