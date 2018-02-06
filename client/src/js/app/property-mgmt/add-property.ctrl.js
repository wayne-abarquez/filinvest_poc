(function(){
'use strict';

angular.module('demoApp.propertyMgmt')
    .controller('addPropertyController', ['gmapServices', addPropertyController]);

    function addPropertyController (gmapServices) {
        var vm = this;

        initialize();
        
        function initialize () {

        }
    }
}());