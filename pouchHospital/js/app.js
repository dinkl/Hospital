define(['angular',
	'jquery',
	'highcharts',
	'jqueryui',
	'route',
	'controllers',
	'directives',
	'bootstrap',
	'commonFunctions',
	'pouch',
	'parse','pace'
	], 
	function (angular,$,Highcharts) {
	'use strict';    
    var app=angular.module('app', ['ngRoute','controllers','directives']);
    var hihgChar

    //Route Provider
    app.config(['$routeProvider','$compileProvider',function($routeProvider,$compileProvider) {
	    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|blob|data):/);
	    $routeProvider.
	      when('/', {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }).
	      when('/login/:mensaje?', {
	        templateUrl: 'templates/login.html',
	        controller: 'loginCtrl'
	      }).
	      when('/hoja/:primary?/:secondary?', {
	        templateUrl: 'templates/hoja.html',
	        controller: 'hojaCtrl'
	      }).
	      when('/usuario', {
	        templateUrl: 'templates/usuario.html',
	        controller: 'usuarioCtrl'
	      }).
	      when('/pacientes/:section?/:primary?/:secondary?', {
	        templateUrl: 'templates/pacientes/mainPacientesTemplate.html',
	        controller: 'pacientesMainCtrl'
	      }).
	      when('/listaPacientes', {
	        templateUrl: 'templates/listaPacientes.html',
	        controller: 'listaPacientesCtrl'
	      }).
	      when('/pacienteInfo/:primary?', {
	        templateUrl: 'templates/pacienteInfo.html',
	        controller: 'pacienteCtrl'
	      }).
	      when('/reportes/:id?', {
	        templateUrl: 'templates/reportesTemplate.html',
	        controller: 'reportesCtrl'
	      }).
	      when('/causes', {
	        templateUrl: 'templates/causesTemplate.html',
	        controller: 'causesCtrl'
	      }).
	      when('/causes/:number', {
	        templateUrl: 'templates/causeDetail.html',
	        controller: 'causeDetailCtrl'
	      }).
	      otherwise({
	        redirectTo: '/'
	      });
	  }]);

    
	//Header Controller
    app.controller('dashboard',  ['$scope','$location', '$rootScope','pouchdb',function($scope,$location,$rootScope,pouchdb) {
    	//Initialize Parse
    	    	Parse.initialize("MseyKya0axGCeWT02BIdp75zvvmAkkg458JH1i3s", "Xy7zqXqyVTlEdZf82Z90NWpRZEDAGlpmSaPzf4Ut");

    	$scope.user= Parse.User.current();
    	$scope.inactive=false

    	$rootScope.evolucionDB = new PouchDB('evolucion');
    	$rootScope.pacientesDB = new PouchDB('pacientes');
		
    	//WATCH FUNCTIONS
    	$scope.$on('$locationChangeStart', function(event) {
		    $scope.user= Parse.User.current();
		    if(!$scope.user&&location.hash.indexOf("login")==-1) location.hash="login";
		    	var tempath=$location.path().split("/")
		    	$scope.activedash=tempath[1]

		});
    	$scope.toggleDashboard=function(){
    		$scope.inactive=!$scope.inactive
    		if($scope.inactive){
    			$("#dashSpacer,#dashboard,#toggleDashboard,.mainSection").addClass("dash-inactive")
    		}else{
    			$("#dashSpacer,#dashboard,#toggleDashboard,.mainSection").removeClass("dash-inactive")
    		}

    	}
    	$scope.logout=function(){
    		Parse.User.logOut();
    		$rootScope.currentUser=null;
    		location.hash="/login"
    	}
	}])
	.factory('pouchdb', function() {
			  PouchDB.enableAllDbs = true;
			  return new PouchDB('myPouch');
			});

;
	
	
    return(app)
}); 