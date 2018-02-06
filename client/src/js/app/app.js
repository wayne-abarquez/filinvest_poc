(function () {
    'use strict';

    angular
        .module('demoApp', [
            'ui.router',
            'ngMessages',
            'ngAnimate',
            'ngMaterial',
            'oitozero.ngSweetAlert',
            'demoApp.home',
            'demoApp.selling',
            'demoApp.estateMgmt',
            'demoApp.planDesign',
            'demoApp.operations',
            'demoApp.permits',
            'demoApp.gsn',
            'demoApp.propertyMgmt'
        ])

        .constant('APP_NAME', 'Filinvest')
        .constant('BASE_URL', window.location.origin)
        .constant('MARKER_BASE_URL', '/images/markers/')

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();
        //    $mdThemingProvider.theme('default')
        //        .primaryPalette('indigo')
        //        .accentPalette('seaGreen');
        })

        .factory('preventTemplateCache', function () {
            var v = Date.now();
            return {
                'request': function (config) {
                    if (config.url.indexOf('templates') !== -1) {
                        config.url = config.url + '?t=' + v;
                    }
                    return config;
                }
            }
        })

        //.config(function ($httpProvider) {
        //    $httpProvider.interceptors.push('preventTemplateCache');
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

                // estate mgmt state
                .state({
                    name: 'map.estateMgmt',
                    url: '/estate-mgmt',
                    templateUrl: '/partials/estate-mgmt/index.page.html',
                    controller: 'estateMgmtPageController',
                    controllerAs: 'esMgmtCtl'
                })

                // property mgmt state
                .state({
                    name: 'map.propertyMgmt',
                    url: '/property-mgmt',
                    templateUrl: '/partials/property-mgmt/index.page.html',
                    controller: 'propertyMgmtPageController',
                    controllerAs: 'propMgmtCtl'
                })

                // planning and design
                .state({
                    name: 'map.planDesign',
                    url: '/plan-and-design',
                    templateUrl: '/partials/plan-design/index.page.html',
                    controller: 'planDesignPageController',
                    controllerAs: 'vm'
                })

                // permits
                .state({
                    name: 'map.permits',
                    url: '/permits',
                    templateUrl: '/partials/permits/index.page.html',
                    controller: 'permitsPageController',
                    controllerAs: 'pmtCtl'
                })

                // gsn
                .state({
                    name: 'map.gsn',
                    url: '/gsn',
                    templateUrl: '/partials/gsn/index.page.html',
                    controller: 'gsnPageController',
                    controllerAs: 'gsnCtl'
                })

                // operations
                .state({
                    name: 'map.operations',
                    url: '/operations',
                    templateUrl: '/partials/operations/index.page.html',
                    controller: 'operationsPageController',
                    controllerAs: 'opCtl'
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

