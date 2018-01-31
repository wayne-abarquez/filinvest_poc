(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['$scope', 'propertyServices', sellingPageController]);

    function sellingPageController($scope, propertyServices) {
        var vm = this;

        vm.form = {};
        vm.isFiltering = false;
        vm.result = {
            items: []
        };

        vm.filter =  {
            propTypeId: '', // property type id
            propertyLocation: '', // property location
            minPrice: '',
            maxPrice: '',
            propertyId: '' // property id
        };

        vm.options = {
            propTypes: [],
            propsLocation: [],
            propsList: []
        };

        vm.clearForm = clearForm;
        vm.search = search;
        vm.onListItemClick = onListItemClick;

        function clearForm() {
            vm.filter = {};
            vm.form.$setPristine();
            vm.form.$setValidity();
            vm.form.$setUntouched();
        }

        function search() {
            vm.isFiltering = true;

            propertyServices.searchProperties(vm.filter)
                .then(function (list) {
                    if (!vm.filter.propId) {
                        vm.options.propsList = [''].concat(list.map(function (item) {
                            return {
                                id: item.id,
                                name: item.name
                            }
                        }));
                    }

                    vm.result.items = [].concat(list);
                    // TODO: group the items by province
                    // TODO: then by location
                })
                .finally(function(){
                    vm.isFiltering = false;
                });
        }

        function onListItemClick(property) {
            propertyServices.highlightProperty(property.id);
        }

        function initialize() {
            propertyServices.getPropertyTypes()
                .then(function (response) {
                    vm.options.propTypes = [''].concat(response.data);
                });

            vm.options.propsLocation = [''].concat(propertyServices.getLocations());

            $scope.$watch(function(){
                return vm.filter;
            }, function(newValue, oldValue){
                console.log(newValue, ' = ', oldValue);
            }, true);
        }

        initialize();
    }
}());