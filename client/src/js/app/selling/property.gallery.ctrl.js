(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyGalleryController', ['property', 'modalServices', propertyGalleryController]);

    function propertyGalleryController(property, modalServices) {
        var vm = this;

        vm.subLabel = 'Features and Amenities';

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
            console.log('propertyGalleryController init');

            vm.property = property;

            vm.carousel.images = [
                {src: '/images/properties/studio-city/interior/Studio-City-Amenities-IMG_9426.jpg'},
                {src: '/images/properties/studio-city/interior/Studio-City-Cabana.jpg'},
                {src: '/images/properties/studio-city/interior/Studio-City-Pool.jpg'},
            ];
        }

        initialize();
    }
}());