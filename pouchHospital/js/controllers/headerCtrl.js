"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('headerCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
  		$scope.activeHeader='home';
        $scope.selSearch=-1;
        $scope.dashBoardActive=true;
        $scope.quickSearch=""
        $scope.quickSearchText=''
        $scope.pFiltered=0;
        $scope.activeCause=false;
        $scope.user= Parse.User.current();
        if($scope.user){
            getCatalogs();
        }else{
            location.hash="login";
        }

        $scope.searchNav=function(e){
            var pacientes=(!$scope.pacienteFiltered||$scope.quickSearchText.length<3)?0:$scope.pacienteFiltered.length;
            var causes=($scope.causesFiltered)?$scope.causesFiltered.length:0;
            setTimeout(function(){
            $scope.pFiltered=pacientes;
            var key=e.keyCode;
                switch(key){
                    case (40)://DOWN KEY
                    if($scope.selSearch+1>=($scope.pFiltered+causes)){
                        $scope.selSearch=0;scrollSearch("top")}
                        else{$scope.selSearch++
                            $scope.$apply()
                            scrollSearch("down")                            
                            //$("#quickSearch").scrollTop($("#quickSearch tr.active:visible").offset().top)
                        }
                        break;
                    case (38)://UP KEY
                        if($scope.selSearch+1<=1){
                        $scope.selSearch=$scope.pFiltered+causes-1;scrollSearch("bottom")}
                        else{$scope.selSearch--;$scope.$apply;scrollSearch("up")}
                        break;
                    case (37):;break;
                    case (39):;break;
                    case (13)://In case of Enter
                            if($("#quickSearch tr.active .arrow-nav").attr("href")){
                                location.hash=$("#quickSearch tr.active .arrow-nav").attr("href")
                                $scope.quickSearchText="";
                            }
                                else{
                                    $("#quickSearch tr.active .arrow-nav").trigger("click");      
                                };
                        break;
                    default:$scope.selSearch=-1;
                }
                $scope.$apply();
                
            },10)
            function scrollSearch(to){
                var container=$("#quickSearch");
                var activeRow=$("#quickSearch tr.active:visible");
                switch(to){
                    case ("down"):if(container.height()<activeRow.offset().top) 
                        container.scrollTop(activeRow.position().top-container.height()+activeRow.height()+20);
                        break;
                    case ("up"):
                        if(activeRow.offset().top<70) 
                        container.scrollTop(activeRow.position().top-70);
                        break;
                    case("top"):container.scrollTop(0);break;
                    case("bottom"):container.scrollTop($("#relativeQuickSearch").height());break;
                }
               
            }
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
                        $scope.selSearch=-1;
                        $rootScope.pacientesList=temp
                        $scope.pacientesList=temp;
                        $rootScope.$apply()
                    },error:function(error){}
                })
        }
	}]);
})