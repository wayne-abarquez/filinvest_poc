(function () {
    'use strict';

    var propertyListDirective = function () {
        return {
            restrict: 'E',
            scope: {
                result: '=',
                onListItemClick: '=',
                propertySelectedId: '='
            },
            templateUrl: '/partials/selling/_property-list.html',
            replace: true
        };
    };

    angular.module('demoApp')
        .directive('propertyList', propertyListDirective);

}());