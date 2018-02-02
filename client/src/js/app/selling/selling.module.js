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

        .constant('PROPERTY_THUMBNAILS', {
            header: '/images/properties/studio-city/thumbnails/Studio-City-Overview-bldg_tn.jpg',
            gallery: [
                '/images/properties/studio-city/thumbnails/interior/Studio-City-Amenities-IMG_9426_tn.jpg',
                '/images/properties/studio-city/thumbnails/interior/Studio-City-Cabana_tn.jpg',
                '/images/properties/studio-city/thumbnails/interior/Studio-City-Pool_tn.jpg'
            ],
            floorPlan: [
                '/images/properties/studio-city/thumbnails/floorplan/Arista-Calibato-ground-floor_tn.jpg',
                '/images/properties/studio-city/thumbnails/floorplan/upper-ground_tn.jpg'
            ],
            unitPlan: [
                '/images/properties/studio-city/thumbnails/floorplan/Unit-Plan_tn.jpg',
                '/images/properties/studio-city/thumbnails/floorplan/standard-studio_tn.jpg',
                '/images/properties/studio-city/thumbnails/floorplan/Studio3_tn.jpg'
            ]
        })
    ;

}());
