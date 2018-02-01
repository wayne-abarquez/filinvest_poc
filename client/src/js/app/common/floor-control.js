/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function FloorsControl(controlDiv, map, data) {
    var that = this;
    var overlay;

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.id = 'floor-container';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    data.floors.reverse().forEach(function(floor){
        // Set CSS for the control interior.
        var controlButton = document.createElement('button');
        controlButton.className = 'floor-button';
        var floorName = floor.name.length > 2
                        ? floor.name.slice(0, 2)
                        : floor.name;
        controlButton.innerHTML = floorName;

        controlButton.setAttribute('data-propertyid', data.propertyid);
        controlButton.setAttribute('data-floorname', floor.name);

        controlUI.appendChild(controlButton);

        var borderBottomDiv = document.createElement('div');
        borderBottomDiv.className = 'floor-button-border';
        controlUI.appendChild(borderBottomDiv);

        controlButton.addEventListener('click', function () {
            if (overlay) overlay.setMap(null);

            var bounds = new google.maps.LatLngBounds(floor.bounds.south_west, floor.bounds.north_east);

            overlay = new FloorplanOverlay(bounds, floor.image_url, map, floorName);
            map.fitBounds(bounds);
        });

        // $(controlButton).trigger('ON_FLOOR_CLICKED', {floor: floor.name});
        // show floorplan here
     });

}