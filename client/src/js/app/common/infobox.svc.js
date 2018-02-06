(function () {
    'use strict';

    angular.module('demoApp')
        .factory('infoboxServices', ['$rootScope', '$filter', 'gmapServices', 'INFOBOX_CLOSED', 'PROPERTY_THUMBNAILS', infoboxServices]);

    function infoboxServices($rootScope, $filter, gmapServices, INFOBOX_CLOSED, PROPERTY_THUMBNAILS) {
        var service = {};

        var scope_;
        var infobox;
        var lastInfoboxOpen;
        var unitInfobox;


        service.initInfobox = initInfobox;
        service.createInfoboxTemplate = createInfoboxTemplate;
        service.openInfobox = openInfobox;
        service.closeInfobox = closeInfobox;

        service.createUnitContent = createUnitContent;
        service.openInfoboxUnit = openInfoboxUnit;

        service.openConstructionStatusInfobox = openConstructionStatusInfobox;
        service.createConstructionStatusContent = createConstructionStatusContent;
        //service.createConstructionStatusInfobox = createConstructionStatusInfobox;


        function closeInfobox() {
            if (lastInfoboxOpen) lastInfoboxOpen.close();
        }

        function openInfobox(infobox, marker) {
            // Close last infobox open
            if (lastInfoboxOpen) lastInfoboxOpen.close();

            lastInfoboxOpen = infobox;

            infobox.open(gmapServices.map, marker);
        }

        function createInfoBox(template, opts) {
            var opts_ = opts || {};

            return new InfoBox(angular.extend({}, {
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
            }, opts_));
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
            content += '<img src="'+ PROPERTY_THUMBNAILS.header +'">';
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
                        PROPERTY_THUMBNAILS.gallery.forEach(function(src){
                            content += '<img src="'+src+'">';
                        });
                    content += '</div>';

                    content += '<div>';
                        PROPERTY_THUMBNAILS.gallery.reverse().forEach(function (src) {
                            content += '<img src="' + src + '">';
                        });
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
            return '<div class="marker_info" id="marker_info"> ' +
                    '<div class="info" id="info">' +
                        '<span class="arrow"></span>' +

                        '<section class="infobox-header"> ' + createHeaderContent(property) + '</section>' +
                        '<section class="infobox-buttons">' + createButtonsContent(property) + '</section>' +
                        '<section class="infobox-body"> ' + createBodyContent(property) + ' </section>' +

                '</div>' +
                '</div>';
        }

        function createUnitButtonsContent(unit) {
            var content = '';
            content += '<button data-propertyid="' + unit.id + '" class="md-button box-button" id="show-property-gallery"><i class="material-icons">photo_library</i> <span>Gallery</span></button>'
            content += '<button data-propertyid="' + unit.id + '" class="md-button box-button" id="show-property-floorplans"><i class="material-icons">layers</i> <span>Floorplans</span></button>'
            content += '<button data-propertyid="' + unit.id + '" class="md-button box-button" id="show-property-details"><i class="material-icons">info</i> <span>More Details</span></button>'
            return content;
        }

        function createUnitPhotosContent(unit, imagesData) {
            console.log('createUnitPhotosContent imagesData: ', imagesData);
            var content = '';

            content += '<div class="body-content">';
                content += '<label>Interior</label>';
                content += '<section class="body-content-images-container">';
                    content += '<div>';
                        imagesData['thumbnails'].forEach(function (src) {
                            content += '<img src="' + src + '">';
                        });
                    content += '</div>';

                content += '</section>';
            content += '</div>';
            return content;
        }

        function createUnitInfoContent(unit) {
            var except = ['id', 'latlng', 'marker', 'unitplan_url'];
            var content = '';
            var labelClass = 'default';

            switch(unit.status) {
                case 'vacant':
                    labelClass = 'success';
                    break;
                case 'occupied':
                    labelClass = 'purple';
                    break;
                case 'sold':
                    labelClass = 'danger';
                    break;
            }

            content += '<div class="body-header">';

            content += '<div>';
                content += '<h3>'+unit.name+'</h3>';
                content += '<span class="label label-' + labelClass + '">' + unit.status + '</span>';
                content += '<span class="badge badge-default">'+unit.type+'</span>';
            content += '</div>';


            content += '<h3>PHP ' + unit.price + '</h3>';

            content += '<button id="show-unit-gallery-btn" data-unittype="'+unit.type+'" data-unitname="' + unit.name + '" class="md-fab md-button md-ink-ripple fab-right-top-btn"><i class="material-icons">photo_library</i></button>';

            return content;
        }

        function createUnitContent(unit, imagesData) {
            return '<div class="marker_info unit-infobox"> ' +
                '<div class="info">' +
                '<span class="arrow"></span>' +

                '<section class="infobox-header"> ' + createUnitInfoContent(unit) + '</section>' +
                //'<section class="infobox-buttons">' + createUnitButtonsContent(unit) + '</section>' +
                '<section class="infobox-body"> ' + createUnitPhotosContent(unit, imagesData) + ' </section>' +

                '</div>' +
                '</div>';
        }

        function openInfoboxUnit(content, marker, infoboxOpts) {
            if (unitInfobox) unitInfobox.setContent(content);
            else unitInfobox = createInfoBox(content, infoboxOpts);

            unitInfobox.open(gmapServices.map, marker);
        }

        //service.openContructInfobox = function(marker, propertyData, scope, compiledContent) {
        //    scope.property = propertyData;
        //
        //    // trigger to compile content
        //    scope.$apply();
        //
        //    var content = compiledContent[0].innerHTML;
        //
        //    if (!infobox) infobox = createInfoBox(content);
        //    else infobox.setContent(content);
        //
        //    openInfobox(infobox, marker);
        //};
        //
        //function generateConstructionStatusContent(scope) {
        //    var container = document.createElement('div');
        //
        //    var content = '<div id="marker_info" class="marker_info" ><div class="info" id="info" ng-include="\'partials/plan-design/_construction-status.infobox.html\'"></div></div>';
        //
        //    container.innerHTML = content;
        //
        //    return $compile(container)(scope);
        //}
        //
        //function createConstructionStatusInfobox(scope) {
        //    var partialInfoboxContent = generateConstructionStatusContent(scope);
        //
        //    console.log('partialInfoboxContent: ', partialInfoboxContent);
        //
        //    return partialInfoboxContent;
        //}

        function createConstructHeaderContent(property) {
            var content = '';
                content += '<img src="/images/properties/studio-city/Studio-City-Logo.jpg">';
            return content;
        }

        function createConstructBodyContent(property, completionDataIndex) {
            var content = '';

            var data = property.completionData;

            var selectedIndex = completionDataIndex ? completionDataIndex : 0;

            var item = property.completionData['completions'][selectedIndex];

            content += '<div>';
                content += '<label>Completion Status</label>';
                content += '<div> <span class="completion-tower">'+data['tower']+'</span> - <span class="completion-percent">' + item.completion + '% Completed</span></div>';
                content += '<div>As of <span class="completion-date">' + item['date'] + '</span></div>';
                content += '<div class="completion"><img class="completion-img" src="' + item.imageSrc+ '"></div>';
                content += '<div>';
                    content += '<button class="md-button md-primary md-icon-button play"><i class="material-icons">play_arrow</i></button>';
                    content += '<button class="md-button md-icon-button stop"><i class="material-icons">stop</i></button>';

            content += '<input class="md-primary" id="construct-completion-input-range" data-propertyid="'+property.id+'" type="range" min="0" max="100" value="'+ item.completionValue +'/> "';
                content += '</div>';
                content += '<hr />';
                content+= '<p class="completion-remarks">'+ item.remarks+'</p>';
            content += '</div>';

            return content;
        }

        function openConstructionStatusInfobox(marker) {
            if (!infobox) infobox = createInfoBox(marker.infoboxContent);
            else infobox.setContent(marker.infoboxContent);

            infobox.setOptions({pixelOffset: new google.maps.Size(30, -200)});

            openInfobox(infobox, marker);
        }

        function createConstructionStatusContent(property, completionDataIndex) {
            var content = '<div class="marker_info construct-infowindow"> ' +
                '<div class="info" id="info">' +
                '<span class="arrow"></span>' +

                '<section class="construct-infobox-header"> ' + createConstructHeaderContent(property) + '</section>' +
                '<section class="construct-infobox-body">' + createConstructBodyContent(property, completionDataIndex) + '</section>' +

                '</div>' +
                '</div>';

            return content;
        };

        return service;
    }
}());