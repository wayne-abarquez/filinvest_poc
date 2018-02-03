(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['$rootScope', '$scope', 'propertyServices', 'INFOBOX_CLOSED', 'PROPERTY_MARKER_SELECTED', 'alertServices', 'floorplanServices', sellingPageController]);

    function sellingPageController($rootScope, $scope, propertyServices, INFOBOX_CLOSED, PROPERTY_MARKER_SELECTED, alertServices, floorplanServices) {
        var vm = this;

        //vm.form = {};
        //vm.isFiltering = false;
        //vm.hasSearched = false;

        vm.result = {
            items: []
        };

        //vm.filter =  {
        //    propTypeId: '', // property type id
        //    propertyLocation: '', // property location
        //    minPrice: '',
        //    maxPrice: '',
        //    propertyId: '' // property id
        //};

        //vm.options = {
        //    propTypes: [],
        //    propsLocation: [],
        //    propsList: []
        //};

        vm.propertySelectedId = null;

        //vm.clearForm = clearForm;
        //vm.search = search;
        vm.onListItemClick = onListItemClick;

        //function clearForm() {
        //    vm.filter = {};
        //    vm.result = {
        //        items: []
        //    };
        //    vm.propertySelectedId = null;
        //
        //    propertyServices.reset(true);
        //    //TODO: hide all markers and infowindow
        //    vm.form.$setPristine();
        //    vm.form.$setValidity();
        //    vm.form.$setUntouched();
        //}
        //
        //function search() {
        //    vm.hasSearched = true;
        //
        //    vm.isFiltering = true;
        //    vm.propertySelectedId = null;
        //
        //    propertyServices.searchProperties(vm.filter)
        //        .then(function (list) {
        //            if (!vm.filter.propId) {
        //                vm.options.propsList = [''].concat(list.map(function (item) {
        //                    return {
        //                        id: item.id,
        //                        name: item.name
        //                    }
        //                }));
        //            }
        //
        //            vm.result = {
        //                province: 'Metro Manila Projects',
        //                location: 'ALABANG',
        //                projectName: 'Filinvest City',
        //                items: [].concat(list)
        //            };
        //
        //            // TODO: group the items by province
        //            // TODO: then by location
        //        })
        //        .finally(function(){
        //            vm.isFiltering = false;
        //        });
        //}

        function onListItemClick(property) {
            vm.propertySelectedId = property.id;
            propertyServices.highlightProperty(property.id);
        }

        function onPropertyInfoboxClosed(e, params) {
            propertyServices.setMarkerToDefault(params.propertyid);
            vm.propertySelectedId = null;
            floorplanServices.clearFloorplanControl();
        }

        function cleanUp() {
            $(document).off('click', '#show-property-gallery');
            $(document).off('click', '#show-property-floorplans');
            $(document).off('click', '#show-property-details');
        }

        function showPropertyDetails(propertyId) {
            propertyServices.showPropertyDetails(propertyId)
                .finally(function(){
                    onPropertyInfoboxClosed({}, {propertyid: propertyId});
                    propertyServices.setBoundsFromProperties();
                });
        }

        function initialize() {
            //propertyServices.getPropertyTypes()
            //    .then(function (response) {
            //        vm.options.propTypes = [''].concat(response.data);
            //    });
            //
            //vm.options.propsLocation = [''].concat(propertyServices.getLocations());

            //$scope.$watch(function(){
            //    return vm.filter;
            //}, function(newValue, oldValue){
            //    console.log(newValue, ' = ', oldValue);
            //}, true);

            $(document).on('click', '#show-property-gallery', function(e){
                var propId = $(this).data('propertyid');
                propertyServices.showGallery(propId);
            });

            $(document).on('click', '#show-property-floorplans', function (e) {
                var propId = $(this).data('propertyid');

                // show floorplan details on left as modal, covering the filter panel
                showPropertyDetails(propId);

                alertServices.showTopRightToast('Select Floor Plan below');

                propertyServices.initFloorplan(propId);
            });

            $(document).on('click', '#show-property-details', function (e) {
                var propId = $(this).data('propertyid');
                showPropertyDetails(propId);
            });

            $rootScope.$on(PROPERTY_MARKER_SELECTED, function(e, params){
                if (!$scope.$$phase) {
                    $scope.$apply(function(){
                        vm.propertySelectedId = params.propertyid;
                    });
                } else {
                    vm.propertySelectedId = params.propertyid;
                }

                propertyServices.highlightProperty(params.propertyid, true);

                var container = $('#selling-page .property-list md-list'),
                    scrollTo = $('#selling-page .property-list md-list md-list-item#property-item-' + params.propertyid);

                var scrollToValue = scrollTo.offset().top - container.offset().top + container.scrollTop();

                container.animate({
                    scrollTop: scrollToValue
                }, 1500);
            });

            $rootScope.$on(INFOBOX_CLOSED, onPropertyInfoboxClosed);

            $scope.$on('$destroy', cleanUp);
        }

        initialize();
    }
}());