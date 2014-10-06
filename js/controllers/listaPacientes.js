"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('listaPacientesCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
  		getList();
  		
  		$rootScope.$watch('pacientesList',function(newValue, oldValue){
  			if(newValue!=oldValue)
  				getList();
  		})
      $scope.deletePacient=function(paciente){
        var parseObj=Parse.Object.extend("pacientes");
        var pobj= new Parse.Query(parseObj)
            pobj.equalTo("objectId",paciente.id)
            if(confirm('Esta seguro de que desea eliminar el paciente "'+paciente.nombre+'"'))
            pobj.first({
              success:function(p){
                p.destroy({
                  success:function(p){
                    alert("se ha eliminado al paciente del registro")
                  },
                  error: function(myObject, error) {
                  }               
                })
              }
            })
            

      }
  		function getList(){
  			$scope.list=$rootScope.pacientesList;
  		}

	}]);
})