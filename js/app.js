define(['angular',
	'jquery',
	'highcharts',
	'jqueryui',
	'route',
	'controllers',
	'directives',
	'bootstrap',
	'parse','pace'
	], 
	function (angular,$,Highcharts) {
	'use strict';    
    var app=angular.module('app', ['ngRoute','controllers','directives']);
    var hihgChar

    //Route Provider
    app.config(['$routeProvider',function($routeProvider) {
	    $routeProvider.
	      when('/', {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }).
	      when('/login/:mensaje?', {
	        templateUrl: 'templates/login.html',
	        controller: 'loginCtrl'
	      }).
	      when('/hoja/:paciente?/:nota?', {
	        templateUrl: 'templates/hoja.html',
	        controller: 'hojaCtrl'
	      }).
	      when('/usuario', {
	        templateUrl: 'templates/usuario.html',
	        controller: 'usuarioCtrl'
	      }).
	      when('/listaPacientes', {
	        templateUrl: 'templates/listaPacientes.html',
	        controller: 'listaPacientesCtrl'
	      }).
	      when('/pacienteInfo/:id?', {
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
    app.controller('headerCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
    	$scope.activeHeader='home';
    	$scope.dashBoardActive=true;
    	$scope.quickSearch=""
    	$scope.quickSearchText=''
    	$scope.activeCause=false;
    	$scope.user= Parse.User.current();
		if($scope.user){
			getCatalogs();
		}else{
			location.hash="login";
		}
		$scope.quickCause=function(cause){
			$scope.activeCause=true;
			$scope.qCause=cause			
		}
		$scope.closeSearch=function(){
			$scope.quickSearchText="";
		}
		$rootScope.$watch("currentUser",function(newVal,oldVal){
			if(newVal!=oldVal){
				$scope.user=newVal;
				if(newVal!=null)							
					getCatalogs();
			}
		})

		function getCatalogs(){
			getCauses();
			getPacientes("id_")
		}
		function getCauses(){
			$.getJSON("js/json/causesFull.json",function(data){
	            for (var d in data){
	            	data[d].label=data[d].NUMERO+" "+data[d].NOMBRE
	            }
	            $rootScope.causesFull=data;
	            $scope.searchList=data
        	})
		}
		function getPacientes(doctor){
			var TestObject = Parse.Object.extend("pacientes");
		        var query= new Parse.Query(TestObject)
		        query.select("NOMBRE","EXPEDIENTE")
		        query.ascending("NOMBRE");
		        query.limit(1500);
		        query.find({
		            success:function(data){
		            	var temp=[]
		               	for (var i in data){
		               		temp.push({label:data[i].get("NOMBRE"),id:data[i].id,nombre:data[i].get("NOMBRE"),expediente:data[i].get("EXPEDIENTE")})
		               	}
		               	$rootScope.pacientesList=temp
		               	$scope.pacientesList=temp;
		               	$rootScope.$apply()
		            },error:function(error){}
		        })
		}    	 
	}]);
	//Header Controller
    app.controller('dashboard',  ['$scope', '$rootScope',function($scope,$rootScope) {
    	//Initialize Parse
    	Parse.initialize("MseyKya0axGCeWT02BIdp75zvvmAkkg458JH1i3s", "Xy7zqXqyVTlEdZf82Z90NWpRZEDAGlpmSaPzf4Ut");
    	$scope.user= Parse.User.current();
    	$scope.inactive=false
    	$scope.$on('$locationChangeStart', function(event) {
		    $scope.user= Parse.User.current();
		    if(!$scope.user&&location.hash.indexOf("login")==-1) location.hash="login"
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
	}]);
	
	
    return(app)
}); 