(function () {
    'use strict';

    angular.module('demoApp')
        .factory('infoboxServices', ['gmapServices', infoboxServices]);

    function infoboxServices(gmapServices) {
        var service = {};

        var lastInfoboxOpen;

        service.initInfobox = initInfobox;
        service.createInfoboxTemplate = createInfoboxTemplate;
        service.openInfobox = openInfobox;

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
            return createInfoBox(template);
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
            return content;
        }

        function createFooterContent(property) {
            var content = '';
            return content;
        }

        function createInfoboxTemplate(property) {
            var imageSrc = property.photos && property.photos.length
                ? property.photos[0].src
                : '/images/default-infowindow-bg.jpg';

            return '<div class="marker_info none" id="marker_info"> ' +
                    '<div class="info" id="info">' +
                        '<span class="arrow"></span>' +

                        '<section class="infobox-header"> ' + createHeaderContent(property) + '</section>' +
                        '<section class="infobox-body"> ' + createBodyContent(property) + ' </section>' +
                        '<section class="infobox-footer">' + createFooterContent(property) + '</section>' +

                '</div>' +
                '</div>';

            // return '<div class="marker_info none" id="marker_info" ' +
            //     'style="background: no-repeat linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + imageSrc + ')  50%/100%;"' +
            //
            //     '><div class="info" id="info">' +
            //     '<h4>' + property.name + '<span></span></h4>' +
            //     '<p>' + (property.type && property.type.name ? property.type.name : 'Not Specified') + '</p>' +
            //     '<a href="#!" class="infowindow_btn btn_view_project_detail">More info</a>' +
            //     '<span class="arrow"></span>' +
            //     '</div>' +
            //     '</div>';
        }

        return service;
    }
}());