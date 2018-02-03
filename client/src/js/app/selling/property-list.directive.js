(function () {
    'use strict';

    var propertyListDirective = function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: '=',
            templateUrl: '/partials/selling/_property-list.html',
            //controller: ['$rootScope', function ($rootScope) {
            //
            //    function initialize() {
            //    }
            //
            //    initialize();
            //
            //}]
        };
    };

    angular.module('demoApp')
        .directive('propertyList', propertyListDirective);

}());