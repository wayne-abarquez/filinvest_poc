(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyDetailsController', ['property', '$scope', '$rootScope', 'modalServices', '$timeout', 'floorplanServices', 'propertyServices', 'PROPERTY_THUMBNAILS', propertyDetailsController]);

    function propertyDetailsController(property, $scope, $rootScope, modalServices, $timeout, floorplanServices, propertyServices, PROPERTY_THUMBNAILS) {
        var vm = this;

        vm.floors = ['1', 'UG'];
        vm.units = [];

        vm.tabShown = 'main';

        vm.propertyImages = PROPERTY_THUMBNAILS;

        vm.back = back;
        vm.showGallery = showGallery;
        vm.showFloorPlanGallery = showFloorPlanGallery;
        vm.showUnitPlanGallery = showUnitPlanGallery;
        vm.goTo = goTo;
        vm.onFloorChange = onFloorChange;
        vm.onUnitSelected = onUnitSelected;

        function onUnitSelected(unit) {
            floorplanServices.triggerClickUnit(unit.id);
        }

        function onFloorChange(floor) {
            $("body #floor-container button.floor-button[data-floorname='" + floor + "']").trigger('click');

            $timeout(function(){
                var result = floorplanServices.getUnitsByFloor(floor);
                vm.units = result;
            }, 500);

            //if (!result.length) return;

            //if (!$scope.$$phase) {
            //    $scope.$apply(function () {
            //        vm.units = result;
            //    });
            //} else {
            //}
        }

        function goTo(tabName) {
            vm.tabShown = tabName;
        }

        function back() {
            modalServices.closeModal();
        }

        function showGallery() {
            modalServices.showPropertyGallery(vm.property);
        }

        function showFloorPlanGallery() {
            modalServices.showFloorPlanGallery(vm.property);
        }

        function showUnitPlanGallery() {
            modalServices.showUnitPlanGallery(vm.property);
        }

        function showUnitInteriorGallery(unitName, unitType) {
            modalServices.showUnitInteriorGallery(unitName, unitType);
        }

        function cleanUp() {
            // show markers
            propertyServices.showOnlyPropertyMarkers();

            // hide legend
            $rootScope.showUnitLegend = false;

            console.log('clean up show prop markers');
        }

        function initialize() {
            vm.property = property;

            vm.propertyImages.galleryReverse = [].concat(vm.propertyImages.gallery).reverse();

            // hide markers temporarily
            propertyServices.hideOnlyPropertyMarkers();

            // show unit legend by status
            $rootScope.showUnitLegend = true;

            vm.selectedFloor = '1';
            $timeout(function(){
                onFloorChange(vm.selectedFloor);
            }, 1000);


            $scope.$on('$destroy', cleanUp);

            $(document).on('click', '#show-unit-gallery-btn', function () {
                var unitName = $(this).data('unitname');
                var unitType = $(this).data('unittype');
                console.log('on click gallery button type: ',unitType);
                // show modal
                showUnitInteriorGallery(unitName, unitType);
            });
        }

        initialize();
    }
}());