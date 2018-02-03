(function(){
'use strict';

angular.module('demoApp.operations')
    .controller('operationsPageController', [operationsPageController]);

    function operationsPageController() {
        var vm = this;

        function initialize () {
            console.log('operationsPageController initailized');
        }

        initialize();
    }
}());