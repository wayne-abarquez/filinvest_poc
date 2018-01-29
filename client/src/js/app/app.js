(function () {
    'use strict';

    angular
        .module('demoApp', [
            'ui.router',
            'ngMaterial',
            'ngMessages',
            'oitozero.ngSweetAlert',
            'demoApp.home'
        ])

        .constant('APP_NAME', 'Demo App')
        .constant('BASE_URL', window.location.origin)

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
                    controller: 'mapPageController',
                    controllerAs: 'vm'
                })

                // selling state
                .state({
                    name: 'map.selling',
                    url: '/selling',
                    templateUrl: '/partials/selling/selling.page.html',
                    //controller: 'mapPageController',
                    //controllerAs: 'vm'
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

