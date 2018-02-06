(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('sellingPageController', ['$rootScope', '$scope', 'propertyServices', 'INFOBOX_CLOSED', 'PROPERTY_MARKER_SELECTED', 'UNIT_MARKER_ICONS', 'MARKER_BASE_URL', 'alertServices', 'floorplanServices', sellingPageController]);

    function sellingPageController($rootScope, $scope, propertyServices, INFOBOX_CLOSED, PROPERTY_MARKER_SELECTED, UNIT_MARKER_ICONS, MARKER_BASE_URL, alertServices, floorplanServices) {
        var vm = this;

        vm.result = {
            items: []
        };

        vm.markerBaseUrl = MARKER_BASE_URL;

        $rootScope.showUnitLegend = false;

        $scope.propertySelectedId = null;

        $scope.onListItemClick = onListItemClick;

        function onListItemClick(item) {
            $scope.propertySelectedId = item.id;
            propertyServices.highlightProperty(item.id);
        }

        function onPropertyInfoboxClosed(e, params) {
            propertyServices.setMarkerToDefault(params.propertyid);
            $scope.propertySelectedId = null;
            floorplanServices.clearFloorplanControl();
        }

        function cleanUp() {
            propertyServices.reset(true);
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
            //$scope.$watch(function(){
            //    return vm.filter;
            //}, function(newValue, oldValue){
            //    console.log(newValue, ' = ', oldValue);
            //}, true);

            $rootScope.markerBaseUrl = MARKER_BASE_URL;
            $rootScope.unitMarkerIcons = angular.merge({}, UNIT_MARKER_ICONS);

            console.log('markerbaseurl: ',vm.markerBaseUrl);
            console.log('unit icons:',vm.unitMarkerIcons);

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
                        $scope.propertySelectedId = params.propertyid;
                    });
                } else {
                    $scope.propertySelectedId = params.propertyid;
                }

                propertyServices.highlightProperty(params.propertyid, true);

                var container = $('.property-list md-list'),
                    scrollTo = $('.property-list md-list md-list-item#property-item-' + params.propertyid);

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