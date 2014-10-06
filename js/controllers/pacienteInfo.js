"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('pacienteCtrl', ['$scope','$routeParams', function($scope,$routeParams) {
  		$scope.edit=false
        var currentPacient;
        if($routeParams.id){
            getUserInfo($routeParams.id)
        }
        function getUserInfo(id){
            $scope.edit=true
            var pObject = Parse.Object.extend("pacientes");
            var paciente= new Parse.Query(pObject)
                paciente.equalTo("objectId",id)
                //query.select("NOMBRE","EXPEDIENTE")
                //query.ascending("NOMBRE");
                paciente.first({
                    success:function(data){
                        if(data!=null){
                            $scope.pacienteinnerID=data.get("ID")
                            $scope.getPastNotes();
                            currentPacient=data;
                            $scope.pacienteId=data.id
                            
                            $scope.expediente=data.get("EXPEDIENTE")
                            $scope.nombre=data.get("NOMBRE")
                            $scope.nacimiento=data.get("NACIMIENTO")
                            $scope.sexo=data.get("SEXO")
                            $scope.oportunidades=data.get("OPORTUNIDADES")
                            $scope.popular=data.get("Numero")
                            $scope.migrante=data.get("MIGRANTE")
                            $scope.indigena=data.get("INDIGENA")
                            $scope.discapacidad=data.get("DISCAPACIDAD")
                            $scope.otro=data.get("OTRO")
                            var edad=$scope.nacimiento.split("/")
                            $scope.edad=calculateAge(edad[1],edad[0],edad[2])
                            $scope.$apply();

                        }
                    },error:function(error){

                    }
                })
        }

        function calculateAge(birthMonth, birthDay, birthYear)
                {
                  var todayDate = new Date();
                  var todayYear = todayDate.getFullYear();
                  var todayMonth = todayDate.getMonth();
                  var todayDay = todayDate.getDate();
                  var age = todayYear - birthYear; 

                  if (todayMonth < birthMonth - 1)
                  {
                    age--;
                  }

                  if (birthMonth - 1 == todayMonth && todayDay < birthDay)
                  {
                    age--;
                  }
                  return age;
                }

        var guid = (function() {
              function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                           .toString(16)
                           .substring(1);
              }
              return function() {
                return s4() + s4() + '-' + s4();
              };
            })();
        $scope.floatFixed=function(val){
            return(parseFloat(val).toFixed(4))
        }
        $scope.getPastNotes=function(lastNumbers){
            var pObject = Parse.Object.extend("ev1");
            $scope.notas=[];
            $scope.charts={};
            $scope.charts.xTitles=[];
            $scope.charts.IMC=[];
            $scope.charts.peso=[];$scope.charts.FC=[];$scope.charts.FR=[];$scope.charts.TC=[];$scope.charts.TA=[];
            var query= new Parse.Query(pObject)
                query.equalTo("ID_PACIENTE",$scope.pacienteinnerID)
                query.select("Fecha","Peso",'Talla','FC','FR','TC','TA','IMC')
                query.find({
                        success:function(notes){
                            for(var i in notes){
                                notes[i].attributes.nota_id=notes[i].id
                                $scope.notas.push(notes[i].attributes)                                
                                $scope.charts.xTitles.push(notes[i].attributes.Fecha)
                                $scope.charts.IMC.push(parseFloat(notes[i].attributes.IMC))
                                $scope.charts.peso.push(parseFloat(notes[i].attributes.Peso))
                                $scope.charts.FC.push(parseFloat(notes[i].attributes.FC))
                                $scope.charts.FR.push(parseFloat(notes[i].attributes.FR))
                                $scope.charts.TC.push(parseFloat(notes[i].attributes.TC))
                                $scope.charts.TA.push(parseFloat(notes[i].attributes.TA))
                                $scope.$apply();
                                $scope.getCharts();
                            }
                            console.log(notes)
                        },error:function(e){}
                })
        }

        $scope.savePacient=function(invalid){
            if(invalid)
                $(".ng-invalid").addClass("ng-dirty")
            else{
                //Select object to update or inser registry
                if(currentPacient==null){
                    var Pacientes = Parse.Object.extend("pacientes");
                    currentPacient = new Pacientes();
                    currentPacient.set("ID", guid());
                }
                currentPacient.set("EXPEDIENTE",$scope.expediente)
                currentPacient.set("NOMBRE",$scope.nombre)
                currentPacient.set("NACIMIENTO",$scope.nacimiento)
                currentPacient.set("SEXO",$scope.sexo)
                currentPacient.set("OPORTUNIDADES",$scope.oportunidades)
                currentPacient.set("Numero",$scope.popular)
                currentPacient.set("MIGRANTE",$scope.migrante)
                currentPacient.set("INDIGENA",$scope.indigena)
                currentPacient.set("DISCAPACIDAD",$scope.discapacidad)

                currentPacient.save(null, {
                  success: function(paciente) {
                    console.log(currentPacient.id)
                    alert('New object created with objectId: ' + paciente.id);
                  },
                  error: function(paciente, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                  }
                });
            }
        }
        function createChart(container,options){
            $(container).highcharts(options)
        }
        $scope.toChart=function(slide){
            $(".paciente-charts").carousel(slide)
        }
        $scope.getCharts=function(){
            createChart("#IMCChart",{title: {text: 'IMC'}, xAxis: {categories: $scope.charts.xTitles},        
                series: [{
                    type: 'line',
                    name: 'IMC',
                    data: $scope.charts.IMC,
                    marker: {
                        lineWidth: 2,
                        color:Highcharts.getOptions().colors[3],
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    }
                }]
            });
            createChart("#PesoChart",{title: {text: 'Peso'}, xAxis: {},        
                series: [{type: 'line',name: 'Kg:',data: $scope.charts.peso,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });createChart("#FCChart",{title: {text: 'FC'}, xAxis: {categories: $scope.charts.xTitles},        
                series: [{type: 'line',name: 'FC',data: $scope.charts.FC,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#FRChart",{title: {text: 'FR'}, xAxis: {categories: $scope.charts.xTitles},        
                series: [{type: 'line',name: 'FR',data: $scope.charts.FR,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#TCChart",{title: {text: 'TC'}, xAxis: {categories: $scope.charts.xTitles},        
                series: [{type: 'line',name: 'TC',data: $scope.charts.TC,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#TAChart",{title: {text: 'Tension Arterial'}, xAxis: {categories: $scope.charts.xTitles},        
                series: [{type: 'line',name: 'TA',data: $scope.charts.TA,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            $(".paciente-charts").on("slide.bs.carousel",function(){ 
                setTimeout(function(){
                    $(window).trigger('resize');},10)
                })
                
            /*$('#IMCChart').highcharts({
                title: {
                    text: 'IMC'
                },
                xAxis: {
                    categories: $scope.charts.xTitles
                },        
                series: [/*{
                    type: 'column',
                    name: 'Jane',
                    data: [3, 2, 1, 3, 4]
                }, {
                    type: 'column',
                    name: 'John',
                    data: [2, 3, 5, 7, 6]
                }, {
                    type: 'column',
                    name: 'Joe',
                    data: [4, 3, 3, 9, 0]
                }, {
                    type: 'line',
                    name: 'IMC',
                    data: $scope.charts.IMC,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    }
                },]
                });*/
        }
        
	}]);
})