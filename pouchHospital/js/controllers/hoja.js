"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('hojaCtrl', ['$scope','$routeParams','$rootScope','pouchdb',  function($scope,$routeParams,$rootScope,pouchdb) {
		var currentPacient;
    var currentNote=null;//instantiate Current note; this is to be able to save or update the parse object
  		$scope.init=function(){
  			$scope.overlay=true;
        $scope.paciente={};
        $scope.evolucion={};
        $scope.cronicoOptions=["No","Tratamiento","Controlado"]
        $scope.cartillaOptions=["No presento","No Actualizada", "Actualizada"]
  			if($routeParams.primary){
  				var pObject = Parse.Object.extend("pacientes");
            	var paciente= new Parse.Query(pObject)
                paciente.equalTo("objectId",$routeParams.primary)
                paciente.first({
                    success:function(data){
                        if(data!=null){
                            currentPacient=data;
                            $rootScope.pacienteActivo={nombre:data.get("NOMBRE"),id:data.id}
                            $scope.pacienteinnerID=data.get("ID")
                            $scope.objectId=data.id
                            getPastNotes($scope.pacienteinnerID)
                            $scope.nombre=data.get("NOMBRE")
                            $scope.paciente.IMAGEN_PERFIL_64=data.get("IMAGEN_PERFIL_64")
                           	$scope.overlay=false;
                            $scope.$apply();


                        }
                    },error:function(error){

                    }
                })
  				
  			}if($routeParams.secondary){
          getEvolucion($routeParams.secondary);
        }
  		}///End of INIT()

      function getEvolucion(nota){
        var pObject = Parse.Object.extend("ev1");
        var Evolution = new Parse.Query(pObject)
                Evolution.equalTo("objectId",nota)
                Evolution.first({
                        success:function(data){
                          currentNote=data
                          console.log(data)
                          $scope.evolucion=data.attributes;
                          $scope.$apply();
                          $scope.getIMC();
                        },error:function(e){
                          alert("reporte invalido")
                        }
                })
      }
      $scope.getIMC=function(){
        if($scope.evolucion.Peso&&$scope.evolucion.Talla){
          var imc=$scope.evolucion.Peso/($scope.evolucion.Talla*$scope.evolucion.Talla)
          $scope.evolucion.IMC=""+parseFloat(imc).toFixed(4)
          var imcText
          if(imc<18.5) imcText="Infrapeso";
          if(imc>=18.5&&imc<=24.9) imcText="Normal";
          if(imc>24.9&&imc<=29.9) imcText="Sobrepeso";
          if(imc>=30) imcText="Obesidad";
          $scope.imcText=imcText;
        }

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
                                  tooltip: {
                                      valueSuffix: ''
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
      $scope.saveNote=function(invalid){
          if(invalid){
                $(".ng-invalid").addClass("ng-dirty")
            }else{
                //Select object to update or inser registry
                if(currentNote==null){
                    var parseOjb = Parse.Object.extend("ev1");
                    currentNote = new parseOjb();
                    currentNote.set("ID_PACIENTE", $scope.pacienteinnerID);//generate new id
                    
                }
                currentNote.set("ID", guid());//generate new id

                //save on local Data base
                $scope.evolucion._id=new Date().toISOString();
                $rootScope.evolucionDB.put($scope.evolucion, function callback(err, result) {
                  if (!err) {
                    console.log(result);
                  }
                });
                //Check for changes on the profile picture

                for(var i in $scope.evolucion){
                     console.log(i+" "+$scope.evolucion[i])                
                     currentNote.set(i,$scope.evolucion[i])
                }
                /*
                currentNote.save(null, {
                  success: function(paciente) {
                    //if(location.hash=='#/pacientes/paciente/'+currentNote.id)
                    //    $route.reload();
                    //else 
                    location.hash="pacientes/paciente/"+$scope.objectId
                    
                  },
                  error: function(paciente, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                  }
                });*/
            }
      }
  		$scope.init();



	}])
	.directive("pacientescomplete",function($parse,$interpolate,$rootScope,$routeParams){
		return function(scope,element,attrs,controller){	
	            $(element).autocomplete({
                minLength:0,
                 position: { my : "left top", at: "left bottom" },
					       source:$rootScope.pacientesList,
					       select:function(ev,ui){
                    $rootScope.pacienteActivo=ui.item;
						        location.hash="pacientes/nota/"+ui.item.id
					       }
				    }).focus();
              
              if($rootScope.pacientesList&&!$routeParams.primary){
                setTimeout(function(){
                  $(element).autocomplete("search",$(element).val())
                },0)
              }
				$rootScope.$watch("pacientesList",function(newVal,oldVal){
					if(newVal!=oldVal){
						$(element).autocomplete("option","source",newVal)
            if(!$routeParams.primary) $(element).autocomplete("search",$(element).val())
            //$(element).focus
					}
				})
				//$(element).autocomplete("widget").addClass("auto-"+attrs.id)
	        }
	})
})