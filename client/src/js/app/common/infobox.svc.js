(function () {
    'use strict';

    angular.module('demoApp')
        .factory('infoboxServices', ['$rootScope', 'gmapServices', 'INFOBOX_CLOSED', infoboxServices]);

    function infoboxServices($rootScope, gmapServices, INFOBOX_CLOSED) {
        var service = {};

        var lastInfoboxOpen;

        service.initInfobox = initInfobox;
        service.createInfoboxTemplate = createInfoboxTemplate;
        service.openInfobox = openInfobox;
        service.closeInfobox = closeInfobox;

        function closeInfobox() {
            if (lastInfoboxOpen) lastInfoboxOpen.close();
        }

        function openInfobox(infobox, marker) {
            // Close last infobox open
            if (lastInfoboxOpen) lastInfoboxOpen.close();

            lastInfoboxOpen = infobox;

            infobox.open(gmapServices.map, marker);
        }

        function createInfoBox(template) {
            return new InfoBox({
                content: template || '',
                disableAutoPan: true,
                maxWidth: 0,
                // closeBoxMargin: '8px 5px',
                boxClass: 'property-infobox',
                // pixelOffset: new google.maps.Size(28, -95),
                pixelOffset: new google.maps.Size(30, -290), // -250 because of infobox height is 500px, half of height + -40
                // closeBoxURL: '/images/close-icon.png',
                isHidden: false,
                // pane: 'floatPane',
                enableEventPropagation: true
            });
        }

        function initInfobox(property) {
            var template = createInfoboxTemplate(property);
            var infobox = createInfoBox(template);

            gmapServices.addListener(infobox, 'closeclick', function(){
               console.log('infobox closeclick');
               $rootScope.$broadcast(INFOBOX_CLOSED, {propertyid: property.id});
            });

            return infobox;
        }

        function createHeaderContent(property) {
            var content = '';
            content += '<img src="/images/properties/studio-city/Studio-City-Overview-bldg.jpg">';
            content += '<div class="header-right-container">';
                content += '<p class="header-right-property-name"> ' + property.name + '</p>';
                content += '<div class="header-right-property-sub">';
                    content += '<span class="header-right-average">5.0</span>';
                    content += '<span class="header-right-stars-container">';

                    for (var i=1; i<=5; i++) {
                        content += '<i class="material-icons header-right-star header-right-star-' + i + ' ">star</i>';
                    }

                    content += '</span>';
                    content += '<span class="header-right-reviews">22 reviews</span>';
                content += '</div>';
            content += '</div>';
            return content;
        }

        function createBodyContent(property) {
            var content = '';
            content += '<div class="body-header">';
                content += '<h3>THE PROJECT IN A CAPSULE</h3>';
                content += '<p>Taking cue from Studio One and Studio Two, Studio City is a five-tower residential condominium laid out to accommodate open, shaded and indoor spaces for the enjoyment of young professionals.</p>';
            content += '</div>';

            content += '<div class="body-content">';
                content += '<label>Features and Amenities</label>';
                content += '<section class="body-content-images-container">';
                    content += '<div>';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Amenities-IMG_9426.jpg">';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Cabana.jpg">';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Pool.jpg">';
                    content += '</div>';

                    content += '<div>';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Pool.jpg">';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Cabana.jpg">';
                        content += '<img src="/images/properties/studio-city/interior/Studio-City-Amenities-IMG_9426.jpg">';
                    content += '</div>';
                content += '</section>';
            content += '</div>';
            return content;
        }

        function createButtonsContent(property) {
            var content = '';
            content += '<button data-propertyid="' + property.id + '" class="md-button box-button" id="show-property-gallery"><i class="material-icons">photo_library</i> <span>Gallery</span></button>'
            content += '<button data-propertyid="' + property.id + '" class="md-button box-button" id="show-property-floorplans"><i class="material-icons">layers</i> <span>Floorplans</span></button>'
            content += '<button data-propertyid="' + property.id + '" class="md-button box-button" id="show-property-details"><i class="material-icons">info</i> <span>More Details</span></button>'
            return content;
        }

        function createInfoboxTemplate(property) {
            return '<div class="marker_info none" id="marker_info"> ' +
                    '<div class="info" id="info">' +
                        '<span class="arrow"></span>' +

                        '<section class="infobox-header"> ' + createHeaderContent(property) + '</section>' +
                        '<section class="infobox-buttons">' + createButtonsContent(property) + '</section>' +
                        '<section class="infobox-body"> ' + createBodyContent(property) + ' </section>' +

                '</div>' +
                '</div>';
        }

        return service;
    }
}());