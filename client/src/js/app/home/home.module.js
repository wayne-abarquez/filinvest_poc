(function () {
    'use strict';

    angular
        .module('demoApp.home', ['chart.js'])

        .config(['ChartJsProvider', function (ChartJsProvider) {
            // Configure all charts
            ChartJsProvider.setOptions({
                colours: ['#2ecc71', '#e74c3c', '#3498db', '#bdc3c7'],
            });

        }])

        .constant('FILTER_ADDRESS_RESULT_RETURNED', 'FILTER_ADDRESS_RESULT_RETURNED')

        .constant('TILES_LOADED', 'TILES_LOADED')
    ;

}());
