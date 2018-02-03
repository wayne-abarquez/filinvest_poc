(function () {
    'use strict';

    angular
        .module('demoApp', [
            'ui.router',
            'ngMaterial',
            'ngMessages',
            'ngHtmlWindow',
            'oitozero.ngSweetAlert',
            'demoApp.home',
            'demoApp.selling',
            'demoApp.planDesign',
            'demoApp.operations'
        ])

        .constant('APP_NAME', 'Filinvest')
        .constant('BASE_URL', window.location.origin)
        .constant('MARKER_BASE_URL', '/images/markers/')

        //.config(function ($mdThemingProvider) {
        //    $mdThemingProvider.theme('default')
        //        .primaryPalette('indigo')
        //        .accentPalette('seaGreen');
        //})

        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider
                // home state
                .state({
                    name: 'home',
                    url: '/',
                    templateUrl: '/partials/home/home.page.html',
                    controller: 'indexController',
                    controllerAs: 'vm'
                })

                // map page
                .state({
                    name: 'map',
                    abstract: true,
                    url: '/map',
                    templateUrl: '/partials/base/map.page.html',
                    controller: 'mapPageController'
                })

                // selling state
                .state({
                    name: 'map.selling',
                    url: '/selling',
                    templateUrl: '/partials/selling/selling.page.html',
                    controller: 'sellingPageController',
                    controllerAs: 'vm'
                })

                // planning and design
                .state({
                    name: 'map.planDesign',
                    url: '/plan-and-design',
                    templateUrl: '/partials/plan-design/index.page.html',
                    controller: 'planDesignPageController',
                    controllerAs: 'vm'
                })

                // operations
                .state({
                    name: 'map.operations',
                    url: '/operations',
                    templateUrl: '/partials/operations/index.page.html',
                    controller: 'operationsPageController',
                    controllerAs: 'vm'
                })

                //.state('pageNotFoundState', {
                //    url: '/404',
                //    templateUrl: 'views/pages/404.html'
                //})
            ;

            //stateHelperProvider
            //    .state({
            //        name: 'mapPage',
            //        templateUrl: '/partials/base/map.page.html',
            //        controller: 'mapPageController',
            //        controllerAs: 'vm',
            //        children: [
            //            {
            //                name: 'selling',
            //                url: '/selling',
            //                templateUrl: '/partials/selling/selling.page.html'
            //            }
            //        ]
            //    });

            $urlRouterProvider.otherwise('/');
        })
    ;

}());

