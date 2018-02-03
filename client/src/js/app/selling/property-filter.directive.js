(function () {
    'use strict';

    var propertyFilterDirective = function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: '=',
            templateUrl: '/partials/selling/_property-filter.html',
            controllerAs: 'vm',
            controller: ['propertyServices', function (propertyServices) {
                var vm = this;

                vm.form = {};
                vm.isFiltering = false;

                vm.filter = {
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

                function clearForm() {
                    vm.filter = {};
                    vm.result = {
                        items: []
                    };
                    vm.propertySelectedId = null;

                    propertyServices.reset(true);
                    //TODO: hide all markers and infowindow
                    vm.form.$setPristine();
                    vm.form.$setValidity();
                    vm.form.$setUntouched();
                }

                function search() {
                    vm.hasSearched = true;

                    vm.isFiltering = true;
                    vm.propertySelectedId = null;

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

                            vm.result = {
                                province: 'Metro Manila Projects',
                                location: 'ALABANG',
                                projectName: 'Filinvest City',
                                items: [].concat(list)
                            };

                            // TODO: group the items by province
                            // TODO: then by location
                        })
                        .finally(function () {
                            vm.isFiltering = false;
                        });
                }

                function initialize() {
                    propertyServices.getPropertyTypes()
                        .then(function (response) {
                            vm.options.propTypes = [''].concat(response.data);
                        });

                    vm.options.propsLocation = [''].concat(propertyServices.getLocations());
                }

                initialize();

            }]
        };
    };

    angular.module('demoApp')
        .directive('propertyFilter', propertyFilterDirective);

}());