define(['angular',
	'jquery',
	'highcharts',
	'jqueryui',
	'route',
	'controllers',
	'bootstrap',
	'parse'
	], 
	function (angular,$,Highcharts) {
	'use strict';    
    var app=angular.module('app', ['ngRoute','controllers']);
    var hihgChar

    //Route Provider
    app.config(['$routeProvider',function($routeProvider) {
	    $routeProvider.
	      when('/', {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }).
	      when('/hoja', {
	        templateUrl: 'templates/hoja.html',
	        controller: 'hojaCtrl'
	      }).
	      when('/listaPacientes', {
	        templateUrl: 'templates/listaPacientes.html',
	        controller: 'listaPacientesCtrl'
	      }).
	      when('/pacienteInfo', {
	        templateUrl: 'templates/pacienteInfo.html',
	        controller: 'pacienteCtrl'
	      }).
	      when('/reportes/:id?', {
	        templateUrl: 'templates/reportesTemplate.html',
	        controller: 'reportesCtrl'
	      }).
	      otherwise({
	        redirectTo: '/'
	      });
	  }]);

    //Header Controller
    app.controller('headerCtrl', ['$scope', function($scope) {
    	$scope.activeHeader='home';
    	$scope.dashBoardActive=true;
    	$scope.quickSearch=""
    	$scope.quickSearchText=''
   		Parse.initialize("MseyKya0axGCeWT02BIdp75zvvmAkkg458JH1i3s", "Xy7zqXqyVTlEdZf82Z90NWpRZEDAGlpmSaPzf4Ut");
   		var TestObject = Parse.Object.extend("causes");
		var query= new Parse.Query(TestObject)
		query.select("numero","titulo")
		query.find({
			success:function(data){console.log(data)},error:function(error){}
		})
	}]);
	
	app.directive("paciente",function($parse,$interpolate,$rootScope){
		
		return{
			templateUrl:"templates/pacienteGeneral.html",
			link:function(scope,element,attrs,controller){
				console.log(attrs)	
				//Defaults
				scope.showName=attrs.showName!="false"?true:false;
				scope.showVitals=attrs.showVitals!="false"?true:false;
				scope.showFace=attrs.showFace!="false"?true:false;
				scope.showButtons=attrs.showButtons!="false"?true:false;
				scope.showEditVitals=attrs.showEditvitals!="true"?false:true;
				scope.showChart=attrs.showChart!="true"?false:true;
				scope.imc="---"
				if(scope.showChart){
					$('#userVitalChart').highcharts({
						chart:{
							backgroundColor:'none',
							height:"170",
						},
						colors:["#FFA500"],
				        title: {
				            text: 'IMC',
				            x: -20 //center
				        },
				        xAxis: {
				            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				        },
				        yAxis: {
				            title: {
				                text: 'Temperature (°C)'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },
				        tooltip: {
				            valueSuffix: '°C'
				        },
				        legend: {
				            layout: 'vertical',
				            align: 'right',
				            verticalAlign: 'middle',
				            borderWidth: 0,
				            enabled:false
				        },
				        series: [{
				            name: 'Paciente',
				            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5,]
				        }]
				    });
				}

			
		}}
	});
	app.directive("omnisearch",function($parse,$interpolate,$rootScope){
		return function(scope,element,attrs,controller){			
			/*
			element.autocomplete({
				source:["A","AB","AC","AD","AE","AF","AG"]
			})
			element.autocomplete("widget").addClass("auto-"+attrs.id)
			*/
		}
	})
    return(app)
}); 