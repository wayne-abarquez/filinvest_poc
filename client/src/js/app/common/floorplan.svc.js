(function(){
'use strict';

angular.module('demoApp')
    .factory('floorplanServices', ['webServices', 'gmapServices', '$timeout', 'MARKER_BASE_URL', 'UNIT_MARKER_ICONS', 'infoboxServices', floorplanServices]);

    function floorplanServices (webServices, gmapServices, $timeout, MARKER_BASE_URL, UNIT_MARKER_ICONS, infoboxServices) {
        var service = {};

        var unitImages = {
            'studio': {
                'hi-res': [
                    '/images/properties/studio-city/interior/units/studio/livingdining-1br.jpg',
                    '/images/properties/studio-city/interior/units/studio/livingdining-2br.jpg',
                    '/images/properties/studio-city/interior/units/studio/living-2br.jpg',
                    '/images/properties/studio-city/interior/units/studio/kidsbr-2br.jpg',
                    '/images/properties/studio-city/interior/units/studio/Bedroom-2br.jpg',
                    '/images/properties/studio-city/interior/units/studio/bedroom2-2BR.jpg'
                ],
                'thumbnails': [
                    '/images/properties/studio-city/thumbnails/interior/units/studio/livingdining-1br_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/studio/livingdining-2br_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/studio/living-2br_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/studio/kidsbr-2br_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/studio/Bedroom-2br_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/studio/bedroom2-2BR_tn.jpg'
                ]
            },
            '1-bedroom': {
                'hi-res': [
                    '/images/properties/studio-city/interior/units/1-bedroom/1-1.jpg',
                    '/images/properties/studio-city/interior/units/1-bedroom/2-1.jpg',
                    '/images/properties/studio-city/interior/units/1-bedroom/3.jpg',
                    '/images/properties/studio-city/interior/units/1-bedroom/5.jpg',
                    '/images/properties/studio-city/interior/units/1-bedroom/6.jpg',
                    '/images/properties/studio-city/interior/units/1-bedroom/7.jpg'
                ],
                'thumbnails': [
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/1-1_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/2-1_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/3_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/5_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/6_tn.jpg',
                    '/images/properties/studio-city/thumbnails/interior/units/1-bedroom/7_tn.jpg'
                ]
            }
        };

        var floorData,
            floorControl;

        var floorControlIndex = 1,
            floorControlPosition = google.maps.ControlPosition.RIGHT_CENTER;

        var floorUnits = [],
            floorUnitInfowindow;


        service.initFloorplan = initFloorplan;
        service.clearFloorplanControl = clearFloorplanControl;
        service.hideFloorUnits = hideFloorUnits;
        service.getUnitsByFloor = getUnitsByFloor;
        service.triggerClickUnit = triggerClickUnit;
        service.getUnitInteriorImages = getUnitInteriorImages;

        function getUnitInteriorImages(type) {
            return unitImages[type.toLowerCase()];
        }

        function triggerClickUnit(unitId) {
            var foundUnit = _.findWhere(floorUnits, {id: unitId});
            if (foundUnit && foundUnit.marker) {
                gmapServices.triggerEvent(foundUnit.marker, 'click');
            }
        }

        function getUnitsByFloor(floor) {
            return floorUnits;
        }

        function onClickUnitMarker() {
            infoboxServices.openInfoboxUnit(this.content, this, {
                pixelOffset: new google.maps.Size(26, -145)
            });
        }

        function hideFloorUnits() {
            if (floorUnits.length) {
                gmapServices.hideMarkers(
                    floorUnits.map(function(item){
                        return item.marker;
                    })
                );

                floorUnits = [];

                if (floorUnitInfowindow) {
                    floorUnitInfowindow.close();
                    floorUnitInfowindow = null;
                }
            }
        }

        function createUnitMarker(data) {
            console.log('createUnitMarker: ',data);
            var icon = MARKER_BASE_URL + UNIT_MARKER_ICONS[data.status.toLowerCase()];
            var marker = gmapServices.createMarker(data.latlng, icon);

            marker.unitId = data.id;

            marker.content = infoboxServices.createUnitContent(data, unitImages[data.type.toLowerCase()]);

            gmapServices.addListener(marker, 'click', onClickUnitMarker.bind(marker));

            return marker;
        }

        function loadFloorUnits(propertyId, floorName) {
            if (!floorUnitInfowindow) floorUnitInfowindow = gmapServices.createInfoWindow('');


            // fetch json data
            webServices.getFloorUnits(propertyId, floorName)
                .then(function(rooms){
                   hideFloorUnits();

                    floorUnits = rooms.map(function(item){
                       item.marker = createUnitMarker(item);
                       return item;
                    });
                });
        }

        function clearFloorplanControl() {
            if (floorControl) {
                floorControl.clearFloorPlanOverlay();
                hideFloorUnits();
                gmapServices.map.controls[floorControlPosition].clear();
            }
        }

        function initFloorplanControls (data) {
            if (floorControl) gmapServices.map.controls[floorControlPosition].clear();

            var controlDiv = document.createElement('div');
            floorControl = new FloorsControl(controlDiv, gmapServices.map, data);
            controlDiv.index = floorControlIndex;
            gmapServices.map.controls[floorControlPosition].push(controlDiv);

            $('#floor-container .floor-button').on('ON_FLOOR_CLICKED', function(e, params){
                console.log('ON_FLOOR_CLICKED params: ', params);
                loadFloorUnits(params.propertyid, params.floor);
            });

            // select the first floor
            $timeout(function(){
                $('#floor-container .floor-button:last').trigger('click').trigger('focus');
            }, 500);
        }

        function initFloorplan(propertyId) {
            webServices.loadFloorplan(propertyId)
                .then(function(data){
                    floorData = data;
                    initFloorplanControls(data);

                    //$(document).on('click', 'button.floor-button', function(e){
                    //    console.log('ON FLOOR CLICKED e: ',e);
                    //    console.log('propertyid: ',$(this).data('propertyid'), ' floorname: ', $(this).data('floorname'));
                    //});
                });

        }

        return service;
    }
}());