"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('hojaCtrl', ['$scope','$routeParams', function($scope,$routeParams) {
		var currentPacient;
  		$scope.init=function(){
  			$scope.overlay=true;
  			if($routeParams.paciente){
  				var pObject = Parse.Object.extend("pacientes");
            	var paciente= new Parse.Query(pObject)
                paciente.equalTo("objectId",$routeParams.paciente)
                paciente.first({
                    success:function(data){
                        if(data!=null){
                            currentPacient=data;
                            $scope.pacienteinnerID=data.get("ID")
                            getPastNotes($scope.pacienteinnerID)
                            $scope.nombre=data.get("NOMBRE")
                           	$scope.overlay=false;
                            $scope.$apply();

                        }
                    },error:function(error){

                    }
                })
  				
  			}if($routeParams.nota){
          getEvolucion($routeParams.nota);
        }
  		}///End of INIT()

      function getEvolucion(nota){
        var pObject = Parse.Object.extend("ev1");
        var query = new Parse.Query(pObject)
                query.equalTo("objectId",nota)
                query.first({
                        success:function(data){
                          $scope.evolucion=data.attributes;
                          $scope.$apply();
                          console.log($scope.evolucion)
                        },error:function(e){
                          alert("reporte invalido")
                        }
                })
      }
      $scope.floatFixed=function(value){
        return(parseFloat(value).toFixed(2))
      }
      function getPastNotes(paciente){
        var pObject = Parse.Object.extend("ev1");
        var query= new Parse.Query(pObject)
        $scope.notas=[]
                query.equalTo("ID_PACIENTE",paciente)
                query.select("Fecha","Peso",'Talla','FC','FR','TC','TA','IMC')
                query.limit(4);
                query.find({
                        success:function(notes){
                          var imcs=[]
                            for(var i in notes){
                                notes[i].attributes.nota_id=notes[i].id
                                $scope.notas.push(notes[i].attributes)
                                imcs.push(parseFloat(notes[i].attributes.IMC))
                                $scope.$apply();

                            }
                            //options for displaying chart
                            var chart={
                              chart:{
                                backgroundColor:'none',
                                height:"170",
                              },
                              colors:["#FFA500"],
                                  title: {
                                      text: 'IMC',
                                      x: -20 //center
                                  },
                                  yAxis: {
                                      title: {
                                          text: 'Indice de masa corporal'
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
                                      data: imcs
                                  }]
                              }
                              $scope.chartJSON=JSON.stringify(chart)
                              $scope.$apply();
                        },error:function(e){}
                })
      }
  		$scope.init();



	}])
	.directive("pacientescomplete",function($parse,$interpolate,$rootScope){
		return function(scope,element,attrs,controller){	
	            $(element).autocomplete({
					source:$rootScope.pacientesList,
					select:function(ev,ui){

						location.hash="hoja/"+ui.item.id
					}

				})
				$rootScope.$watch("pacientesList",function(newVal,oldVal){
					if(newVal!=oldVal){
						$(element).autocomplete("option","source",newVal)
					}
				})
				//$(element).autocomplete("widget").addClass("auto-"+attrs.id)
	        }
	})
})