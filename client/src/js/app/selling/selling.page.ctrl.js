(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['webServices', sellingPageController]);

    function sellingPageController(webServices) {
        var vm = this;

        vm.form = {};

        vm.filter =  {
            propType: '',
            location: '',
            priceRange: '',
            propName: ''
        };

        function initialize() {
            console.log('sellingPageController init');

            webServices.getProperties()
                .then(function(response){
                   console.log('getProperties response: ', response);
                });
        }

        initialize();
    }
}());