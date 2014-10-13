"use strict";
define(['angular','jquery',],function (angular,$) {

angular.module("controllers")
	.controller('usuarioCtrl', ['$scope', function($scope) {
  		$('#consultasMensuales').highcharts({
						chart:{
							backgroundColor:'none',
							height:"170",
						},
						colors:["#FFA500"],
				        title: {
				            text: 'Consultas',
				            x: -20 //center
				        },
				        xAxis: {
				            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				        },
				        yAxis: {
				            title: {
				                text: 'Consultas'
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
				    });	}]);
})