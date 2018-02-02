(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyFloorPlanGalleryController', ['property', 'modalServices', propertyFloorPlanGalleryController]);

    function propertyFloorPlanGalleryController(property, modalServices) {
        var vm = this;

        vm.subLabel = 'Floor Plan';

        vm.carousel = {
            images: [],
            maxWidth: 700,
            maxHeight: 400,
            templateUrl: '/partials/selling/_property-gallery-item-template.html',
            currentIndex: 0
        };

        vm.close = close;

        function close() {
            modalServices.closeModal();
        }

        function initialize() {
            vm.property = property;

            vm.carousel.images = [
                {src: '/images/properties/studio-city/floorplan/Arista-Calibato-ground-floor.jpg'},
                {src: '/images/properties/studio-city/floorplan/upper-ground.jpg'},
            ];
        }

        initialize();
    }
}());