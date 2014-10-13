"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.directive("datepicker",function($parse,$interpolate,$rootScope){

		return{
			restrict:'E',
			template:"<div></div>",
			link: function(scope,element,attrs,controller){
				$("div", element).datepicker();
			}
		}
	})
	.controller('reportesCtrl', ['$scope','$location', function($scope, $location) {
  		$scope.isActive = function (viewLocation) {
		     var active = (viewLocation === $location.path());
		     return active;
		};
	}]);
})