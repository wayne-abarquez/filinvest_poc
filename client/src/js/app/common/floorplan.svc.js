(function(){
'use strict';

angular.module('demoApp')
    .factory('floorplanServices', ['webServices', 'gmapServices', floorplanServices]);

    function floorplanServices (webServices, gmapServices) {
        var service = {};

        var floorData,
            floorControl;

        var floorControlIndex = 1,
            floorControlPosition = google.maps.ControlPosition.RIGHT_CENTER;

        service.initFloorplan = initFloorplan;
        service.clearFloorplanControl = clearFloorplanControl;


        function clearFloorplanControl() {
            if (floorControl) gmapServices.map.controls[floorControlPosition].clear();
        }

        function initFloorplanControls (data) {
            if (floorControl) gmapServices.map.controls[floorControlPosition].clear();

            var controlDiv = document.createElement('div');
            floorControl = new FloorsControl(controlDiv, gmapServices.map, data);
            controlDiv.index = floorControlIndex;
            gmapServices.map.controls[floorControlPosition].push(controlDiv);
        }

        function initFloorplan(propertyId) {
            console.log('initFloorplanControls');

            webServices.loadFloorplan(propertyId)
                .then(function(data){
                    // console.log('load floorplan request: ', data);

                    floorData = data;
                    initFloorplanControls(data);

                    $(document).on('click', 'button.floor-button', function(e){
                        // TODO: show floorplan details on left as modal, covering the filter panel

                        console.log('ON FLOOR CLICKED e: ',e);
                        console.log('propertyid: ',$(this).data('propertyid'), ' floorname: ', $(this).data('floorname'));
                    });
                });

        }

        return service;
    }
}());