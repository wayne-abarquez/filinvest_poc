(function () {
    'use strict';

    angular.module('demoApp.selling')
        .controller('propertyUnitInteriorGalleryController', ['unit', 'modalServices', 'floorplanServices', propertyUnitInteriorGalleryController]);

    function propertyUnitInteriorGalleryController(unit, modalServices, floorplanServices) {
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
            vm.unit = unit;

            var images = floorplanServices.getUnitInteriorImages(unit.type);

            vm.carousel.images = images['hi-res'].map(function(src){
                return {
                    src: src
                };
            });
        }

        initialize();
    }
}());