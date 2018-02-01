(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['$rootScope', '$scope', 'propertyServices', 'INFOBOX_CLOSED', sellingPageController]);

    function sellingPageController($rootScope, $scope, propertyServices, INFOBOX_CLOSED) {
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

        vm.propertySelectedId = null;

        vm.clearForm = clearForm;
        vm.search = search;
        vm.onListItemClick = onListItemClick;

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
                .finally(function(){
                    vm.isFiltering = false;
                });
        }

        function onListItemClick(property) {
            vm.propertySelectedId = property.id;
            propertyServices.highlightProperty(property.id);
        }

        function onPropertyInfoboxClosed(e, params) {
            console.log('onPropertyInfoboxClosed: ',params);

            propertyServices.setMarkerToDefault(params.propertyid);

            vm.propertySelectedId = null;
        }

        function cleanUp() {
            $(document).off('click', '#show-property-gallery');
            $(document).off('click', '#show-property-floorplans');
            $(document).off('click', '#show-property-details');
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

            $('#show-property-gallery').on('click', function(e){
                var propId = $(this).data('propertyid');
            });

            $(document).on('click', '#show-property-floorplans', function (e) {
                var propId = $(this).data('propertyid');
                propertyServices.initFloorplan(propId);
            });

            $('#show-property-details').on('click', function (e) {
                var propId = $(this).data('propertyid');
            });

            $rootScope.$on(INFOBOX_CLOSED, onPropertyInfoboxClosed);

            $scope.$on('$destroy', cleanUp);
        }

        initialize();
    }
}());