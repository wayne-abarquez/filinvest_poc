(function(){
'use strict';

angular.module('demoApp.operations')
    .controller('placesOfInterestPanelController', ['$mdSidenav', '$rootScope', 'placesOfInterestServices', 'ON_PROPERTY_FILTER_RESULT', 'gmapServices', 'propertyServices', placesOfInterestPanelController]);

    function placesOfInterestPanelController ($mdSidenav, $rootScope, placesOfInterestServices, ON_PROPERTY_FILTER_RESULT, gmapServices, propertyServices) {
        var vm = this;

        var initialSelectedPlaces = ['police', 'fire_station'];

        vm.placeTypes = [];
        vm.pois = [];


        vm.onClickPOI = onClickPOI;
        vm.reloadPOIs = reloadPOIs;
        vm.closeSidenav = closeSidenav;


        function onClickPOI(item) {
            placesOfInterestServices.showMarker(item);
        }

        function reloadPOIs() {
            getPOIs(
                _.filter(vm.placeTypes, function (type) {
                    return type.isSelected;
                }).map(function (t) {
                    return t.type;
                }),
                propertyServices.getBoundsFromProperties()
            );
        }


        function getPOIs(types, bounds) {
            placesOfInterestServices.getNearbyPOIByType(types, bounds)
                .then(function(result){
                    console.log('getPOIs result: ',result);
                    vm.pois = result;
                });
        }

        function closeSidenav() {
            $mdSidenav('poiPanel')
                .close();
        }

        function initialize () {
            vm.placeTypes = placesOfInterestServices.placeTypes.map(function(item){
                item.isSelected = initialSelectedPlaces.indexOf(item.type) > -1 ? true : false;
                return item;
            });

            $rootScope.$on(ON_PROPERTY_FILTER_RESULT, function(e, result){
                getPOIs(
                    _.filter(vm.placeTypes, function(type){ return type.isSelected; }).map(function(t) {return t.type;}),
                    gmapServices.getBoundsFromPath(result.items.map(function(item){return item.latlng;}))
                );
            });
        }

        initialize();
    }
}());