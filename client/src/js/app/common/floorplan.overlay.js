FloorplanOverlay.prototype = new google.maps.OverlayView();

/** @constructor */
function FloorplanOverlay(bounds, image, map, floorName) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.floorName_ = floorName;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
FloorplanOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.id = 'floorplan-overlay';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.image_;
    img.className = 'floorplan-overlay-image';

    var heading = google.maps.geometry.spherical.computeHeading(this.bounds_.getSouthWest(), this.bounds_.getNorthEast());

    // new google.maps.Marker({
    //     map:this.map_,
    //     position: this.bounds_.getNorthEast(),
    //     icon: '/images/markers/default-marker.png'
    // });
    //
    // new google.maps.Marker({
    //     map: this.map_,
    //     position: this.bounds_.getSouthWest(),
    // });

    // console.log('heading: ', heading);

    // if (this.floorName_ == 'UG') {
    //     // rotate image 90 degrees
    //     img.style.transform = 'rotate(105deg)';
    img.style.transform = 'rotate('+(heading+50)+'deg)';
    // img.style.maxWidth = '200px';
    // }


    // TODO: upon showing floorplan, show room markers, color coded by status availability

    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

FloorplanOverlay.prototype.draw = function () {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
FloorplanOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

