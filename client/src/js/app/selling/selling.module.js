(function () {
    'use strict';

    angular
        .module('demoApp.selling', ['jkAngularCarousel'])

        .constant('PROPERTY_ICONS', ['fi-marker-blue.png', 'fi-marker-green.png', 'fi-marker-orange.png', 'fi-marker-red.png'])

        .constant('INFOBOX_CLOSED', 'INFOBOX_CLOSED')

        .constant('PROPERTY_MARKER_SELECTED', 'PROPERTY_MARKER_SELECTED')

        .constant('UNIT_MARKER_ICONS', {
            'sold': 'unit_pinlet-small-sold.png',
            'vacant': 'unit_pinlet-small-vacant.png',
            'occupied': 'unit_pinlet-small-occupied.png'
        })
    ;

}());
