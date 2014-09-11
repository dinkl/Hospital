require.config({
    //baseUrl: 'js/lib',
    packages:["controllers"],
    paths: {
        angular:'lib/angular',
        route:'lib/angular-route',      
        jquery: 'lib/jquery-2.1.1.min',
        jqueryui:'lib/jquery-ui.min',
        bootstrap:'lib/bootstrap.min',
        highcharts:'lib/highcharts/highcharts',
        parse: 'lib/parse-1.3.0.min'
        
    },
    shim:{
        angular:{
            exports:'angular'
        },
        route:{
            deps:['angular']
        },
        jquery:{
            exports:'$'
        },  
        jqueryui:{
            deps:['jquery']
        },
        parse:{
            deps:['jquery'],
            exports:"Parse"
        },
        highcharts: {
                "exports": "Highcharts",
                "deps": [ "jquery"] 
            },  
        bootstrap:{
            deps:['jquery']
        },
        "controllers/main":{
            deps:['angular']
        },
    },
    //deps: ['./app']
});
define(['angular','app'], function (app) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });
    
});