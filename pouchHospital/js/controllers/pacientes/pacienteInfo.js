"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('pacienteCtrl', ['$scope','$routeParams','$rootScope','$route', function($scope,$routeParams,$rootScope,$route) {
  		$scope.edit=false
        var currentPacient;
        if($routeParams.primary){
            getUserInfo($routeParams.primary)
        }
        function getUserInfo(id){
            $scope.edit=true
            $rootScope.pacienteActivo=null;
            var pObject = Parse.Object.extend("pacientes");
            var paciente= new Parse.Query(pObject)
                paciente.equalTo("objectId",id)
                paciente.first({
                    success:function(data){
                        if(data!=null){
                            currentPacient=data;
                            $rootScope.pacienteActivo={nombre:data.get("NOMBRE"),id:data.id}
                            $scope.paciente=data.attributes;
                            $scope.pacienteId=data.id
                            $scope.pacienteinnerID=data.get("ID")
                            $scope.getPastNotes();
                            var edad=$scope.paciente.NACIMIENTO.split("/")
                            $scope.edad=calculateAge(edad[1],edad[0],edad[2])
                            
                            console.log($scope.paciente)
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
            $rootScope.evolucionDB.allDocs({include_docs: true, descending: true}, function(err, docs) {
               //$scope.notas.push(doc)
               console.log(docs)
               docs=docs.rows;
               for (var i in docs){
                $scope.notas.push(docs[i].doc)                               
                $scope.charts.xTitles.push(docs[i].doc.Fecha)
                $scope.charts.IMC.push(parseFloat(docs[i].doc.IMC))
                $scope.charts.peso.push(parseFloat(docs[i].doc.Peso))
                $scope.charts.FC.push(parseFloat(docs[i].doc.FC))
                $scope.charts.FR.push(parseFloat(docs[i].doc.FR))
                $scope.charts.TC.push(parseFloat(docs[i].doc.TC))
                $scope.charts.TA.push(parseFloat(docs[i].doc.TA))
                $scope.$apply();
               }
               $scope.charts.size=docs.length
                            $scope.getCharts();
               
              });
            /*
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
                                
                            }
                            $scope.charts.size=notes.length
                            $scope.getCharts();
                           
                        },error:function(e){}
                })*/
        }

        $scope.savePacient=function(invalid){
            if(invalid){
                $(".ng-invalid").addClass("ng-dirty")
                console.log("invalid")
            }else{
                //Select object to update or inser registry
                if(currentPacient==null){
                    var Pacientes = Parse.Object.extend("pacientes");
                    currentPacient = new Pacientes();
                    currentPacient.set("ID", guid());
                }
                //Check for changes on the profile picture
                var profilePicture=$("#userImageUpload")[0].files;
                if(profilePicture.length>0&&$scope.previewMin){
                    currentPacient.set("IMAGEN_PERFIL_64",$scope.previewMin)
                }
                for(var i in $scope.paciente){                    
                    if(i=="IMAGEN_PERFIL_64")
                        continue                        
                    else{

                     currentPacient.set(i,$scope.paciente[i])}
                }
                currentPacient.save(null, {
                  success: function(paciente) {
                    if(location.hash=='#/pacientes/paciente/'+currentPacient.id)
                        $route.reload();
                    else location.hash="pacientes/paciente/"+currentPacient.id
                    
                  },
                  error: function(paciente, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                  }
                });
            }
        }
        $scope.changeFile=function(ev){
            var el=$(ev.currentTarget)
            var file=el[0].files
            console.log($scope)
            if((file.length)){                
                console.log(window.URL.createObjectURL(file[0]))
                $scope.paciente.IMAGEN_PERFIL_64=""+window.URL.createObjectURL(file[0])   

                $scope.$apply(function(){})
                setTimeout(function(){
                    var img=document.getElementById("profilePreview")
                    resizePicture(img,file[0].type)
                },100)
                
            }
        }
       $scope.imageChange=function(){
                    var img=document.getElementById("profilePreview")
                    resizePicture(img)
       }
        function resizePicture(img,type){
            var MAX_WIDTH = 100;
            var MAX_HEIGHT = 120;
            var width = img.width;
            var height = img.height;
            var canvas=document.getElementById("previewMin")
            
            canvas.width = MAX_WIDTH;
            canvas.height = MAX_HEIGHT;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            $scope.previewMin=canvas.toDataURL(type)
            $scope.$apply();
        }
        function createChart(container,options){
            $(container).highcharts(options)
        }
        $scope.toChart=function(slide){
            $(".paciente-charts").carousel(slide)
        }
        $scope.getCharts=function(){
            var cheight=$scope.charts.size*37+57;
            createChart("#IMCChart",{title: {text: 'IMC'}, xAxis: {categories: $scope.charts.xTitles},        
                chart:{height:cheight},
                legend:{enabled:false},
                series: [{
                    type: 'area',
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
            createChart("#PesoChart",{title: {text: 'Peso'}, xAxis: {}, chart:{height:cheight}, legend:{enabled:false},       
                series: [{type: 'line',name: 'Kg:',data: $scope.charts.peso,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });createChart("#FCChart",{title: {text: 'FC'}, xAxis: {categories: $scope.charts.xTitles},chart:{height:cheight}, legend:{enabled:false},        
                series: [{type: 'line',name: 'FC',data: $scope.charts.FC,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#FRChart",{title: {text: 'FR'}, xAxis: {categories: $scope.charts.xTitles}, chart:{height:cheight}, legend:{enabled:false},       
                series: [{type: 'line',name: 'FR',data: $scope.charts.FR,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#TCChart",{title: {text: 'TC'}, xAxis: {categories: $scope.charts.xTitles}, chart:{height:cheight}, legend:{enabled:false},       
                series: [{type: 'line',name: 'TC',data: $scope.charts.TC,
                        marker: {
                            lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'
                        }
                }]
            });
            createChart("#TAChart",{title: {text: 'Tension Arterial'}, xAxis: {categories: $scope.charts.xTitles}, chart:{height:cheight}, legend:{enabled:false},       
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
        }
        
	}]);
})