(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyDetailsController', ['property', 'modalServices', '$timeout', 'floorplanServices', 'PROPERTY_THUMBNAILS', propertyDetailsController]);

    function propertyDetailsController(property, modalServices, $timeout, floorplanServices, PROPERTY_THUMBNAILS) {
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
                console.log('on flor hcnage result: ', result);
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

        function initialize() {
            vm.property = property;

            vm.propertyImages.galleryReverse = [].concat(vm.propertyImages.gallery).reverse();

            //gmapServices.addMapListener('click', function(e){
            //    console.log('map click e: ', JSON.stringify(e.latLng.toJSON()));
            //});

            vm.selectedFloor = '1';
            $timeout(function(){
                onFloorChange(vm.selectedFloor);
            }, 1000);
        }

        initialize();
    }
}());