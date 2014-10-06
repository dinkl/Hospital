"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('causesCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
  		//var TestObject = Parse.Object.extend("causes");
        //var query= new Parse.Query(TestObject)
        $scope.causes=$rootScope.causesFull
        /*query.select("numero","titulo")
        query.ascending("numero");
        query.limit(285);
        query.find({
            success:function(data){
                $scope.causes=data
                //$scope.causes=[{nombre:"test"},{nombre:"other"}]
                $scope.$apply()
            },error:function(error){}
        })*/
	}]);
})