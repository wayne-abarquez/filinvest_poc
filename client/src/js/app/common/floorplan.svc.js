(function(){
'use strict';

angular.module('demoApp')
    .factory('floorplanServices', ['webServices', 'gmapServices', '$timeout', '$filter', 'MARKER_BASE_URL', 'UNIT_MARKER_ICONS', floorplanServices]);

    function floorplanServices (webServices, gmapServices, $timeout, $filter, MARKER_BASE_URL, UNIT_MARKER_ICONS) {
        var service = {};

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
            if (!floorUnitInfowindow) floorUnitInfowindow = gmapServices.createInfoWindow('');

            floorUnitInfowindow.setContent(this.content);

            floorUnitInfowindow.open(this.getMap(), this);
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

        function generateUnitInfowindowContent(data) {
            var content = '<div class="md-whiteframe-3dp">';
            var except = ['id', 'latlng', 'marker', 'unitplan_url'];
            for (var k in data) {
                if (except.indexOf(k) > -1) continue;
                content += '<div>' + $filter('capitalize')(k) + ': ' + '<b>' + $filter('capitalize')(data[k]) + '</b></div>';
            }
            content += '</div>';
            return content;
        }

        function createUnitMarker(data) {
            var icon = MARKER_BASE_URL + UNIT_MARKER_ICONS[data.status.toLowerCase()];
            var marker = gmapServices.createMarker(data.latlng, icon);

            marker.unitId = data.id;

            marker.content = generateUnitInfowindowContent(data);
            // create content for infowindow
            //marker.infobox = infoboxServices.initInfobox(data);

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