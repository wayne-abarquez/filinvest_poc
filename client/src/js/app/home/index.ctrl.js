(function(){
'use strict';

angular.module('demoApp.home')
    .controller('indexController', [indexController]);

    function indexController () {
        var vm = this;

        vm.initialize = initialize;

        function initialize() {
            console.log('indexController init');
        }

        initialize();
    }
}());