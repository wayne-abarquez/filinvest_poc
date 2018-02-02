(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyUnitPlanGalleryController', ['property', 'modalServices', propertyUnitPlanGalleryController]);

    function propertyUnitPlanGalleryController(property, modalServices) {
        var vm = this;

        vm.subLabel = 'Unit Plan';

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
                {src: '/images/properties/studio-city/floorplan/Unit-Plan.jpg'},
                {src: '/images/properties/studio-city/floorplan/standard-studio.jpg'},
                {src: '/images/properties/studio-city/floorplan/Studio3.jpg'},
            ];
        }

        initialize();
    }
}());