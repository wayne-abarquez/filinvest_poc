(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['$scope', 'propertyServices', sellingPageController]);

    function sellingPageController($scope, propertyServices) {
        var vm = this;

        vm.form = {};

        vm.filter =  {
            propType: '',
            location: '',
            priceRange: '',
            propId: ''
        };

        vm.options = {
            propTypes: [],
            propsLocation: [],
            propsList: []
        };

        function initialize() {
            propertyServices.loadProperties()
                .then(function (list) {
                    console.log('getProperties: ', list);
                    vm.options.propsList = list.map(function(item){
                        return {
                            id: item.id,
                            name: item.name
                        }
                    })
                });

            propertyServices.getPropertyTypes()
                .then(function (response) {
                    console.log('getPropertyTypes: ', response);
                    vm.options.propTypes = [].concat(response.data);
                });

            vm.options.propsLocation = [].concat(propertyServices.getLocations());

            $scope.$watch(function(){
                return vm.filter;
            }, function(newValue, oldValue){
                console.log(newValue, ' = ', oldValue);
            }, true);
        }

        initialize();
    }
}());