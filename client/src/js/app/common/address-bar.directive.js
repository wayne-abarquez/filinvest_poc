(function(){
'use strict';

    var filterAddressBarDirective = function () {
        return {
            restrict: 'E',
            // replace: 'true',
            scope: {},
            templateUrl: '/partials/common/_filter_address_bar.html',
            controller: ['$rootScope', 'gmapServices', 'FILTER_ADDRESS_RESULT_RETURNED', function ($rootScope, gmapServices, FILTER_ADDRESS_RESULT_RETURNED) {

                var autocomplete,
                    place;

                function placeChangeCallback() {
                    place = autocomplete.getPlace();

                    if (!place.geometry) {
                        console.log("Autocomplete's returned place contains no geometry");
                        return;
                    }

                    $rootScope.$broadcast(FILTER_ADDRESS_RESULT_RETURNED, place);

                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        gmapServices.map.fitBounds(place.geometry.viewport);
                        return;
                    }

                    gmapServices.map.setCenter(place.geometry.location);
                    gmapServices.map.setZoomIfGreater(15);
                }

                function initialize() {
                    autocomplete = gmapServices.initializeAutocomplete('filter-address-input');
                    autocomplete.addListener('place_changed', placeChangeCallback);
                }

                initialize();

            }]
        };
    };

    angular.module('demoApp')
        .directive('filterAddressBar', filterAddressBarDirective);

}());