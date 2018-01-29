(function(){
'use strict';

angular.module('demoApp.home')
    .controller('mapPageController', ['gmapServices', mapPageController]);

    function mapPageController(gmapServices) {

        var vm = this;

        function initialize () {
            gmapServices.createMap('map-canvas');
        }

        initialize();

    }
}());