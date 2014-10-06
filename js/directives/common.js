"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("directives",[])
.directive("paciente",function($parse,$interpolate,$rootScope){
		
		return{
			templateUrl:"templates/pacienteGeneral.html",
			link:function(scope,element,attrs,controller){				
				//Defaults
				scope.pname=attrs.name
				scope.showName=attrs.showName!="false"?true:false;
				scope.showVitals=attrs.showVitals!="false"?true:false;
				scope.showFace=attrs.showFace!="false"?true:false;
				scope.showButtons=attrs.showButtons!="false"?true:false;
				scope.showEditVitals=attrs.showEditvitals!="true"?false:true;
				scope.showChart=attrs.showChart!="true"?false:true;
				
				if(scope.showChart){
					attrs.$observe('chart',function(chartJSON){
						if(chartJSON!=""){
							var chart=JSON.parse(chartJSON)
							$('#userVitalChart').highcharts(chart);
						}
					})
					
				}

			
		}}
	})
.directive("quickchart",function($parse,$interpolate,$rootScope){
		
		return{
			templateUrl:"templates/pacienteGeneral.html",
			link:function(scope,element,attrs,controller){				
				$(element).highcharts({
						chart:{
							backgroundColor:'none',
							height:"170",
						},
						colors:["#FFA500"],
				        title: {
				            text: '',
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

			
		}
	})
.directive("quickCause",function($parse,$interpolate,$rootScope){
		return {
			templateUrl:"templates/causeDetail.html",
			scope:{},
			link:function(scope,element,attrs,controller){
				
				attrs.$observe('cause', function(causeId) {
					if(causeId!=""){
         			for(var i in $rootScope.causesFull){
		            	if(causeId==$rootScope.causesFull[i].NUMERO)
		                	scope.cause=$rootScope.causesFull[i]
		       		}
		       		 scope.minimized=false;
		       		 scope.$watch("minimized",function(newVal,oldval){
		       		 	if(newVal) $(element).addClass("minimized");
		       		 		else $(element).removeClass("minimized");		       		 	
		       		 })
		       		 scope.close=function(){
		       		 	scope.$parent.activeCause=false
		       		 	scope.minimized=false
		       		 }
		       		 scope.quickCause=true;
		        	 scope.splitCIE10=(scope.cause.CIE10).split("\n")
		       		 scope.splitCIE9=(scope.cause.CIE9).split("\n")
		       		 scope.splitNormatividad=(scope.cause.NORMATIVIDAD).split("\n")
		       		 scope.splitAuxiliares=(scope.cause.AUXILIARES).split("\n")
		        		scope.splitCIE10=(scope.cause.CIE10).split("\n")
		        		var list=scope.cause.MEDICAMENTOS;
		        		var tempList=list.split("\n");
		        		$.getJSON("js/json/medicamentos.json",function(data){
		          		 	scope.medicamentos=[]
		         		 	for (var d in data){
		                		if(tempList.indexOf(data[d].clave)!=-1)
		                    		scope.medicamentos.push(data[d])
		            		}
		            		scope.$apply();
		        		})
		        	}
         		});
		        
			}}
	})
	.directive("datepicker",function($parse,$interpolate,$rootScope){
			return {	
				link:function(scope,element,attrs,controller){
					$(element).datepicker({
						 changeMonth: true,
      				     changeYear: true
					});
				}
			}
		})
	.directive("omnisearch",function($parse,$interpolate,$rootScope){
		return function(scope,element,attrs,controller){	
			$.getJSON("js/json/causesFull.json",function(data){
	            for (var d in data){
	            	data[d].label=data[d].NUMERO+" "+data[d].NOMBRE
	            }
	            $rootScope.causesFull=data;
	            $(element).autocomplete({
					source:data
				})
				$(element).autocomplete("widget").addClass("auto-"+attrs.id)
	        })	
		}
	})
})