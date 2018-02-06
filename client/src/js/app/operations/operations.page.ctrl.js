(function(){
'use strict';

angular.module('demoApp.operations')
    .controller('operationsPageController', ['$scope', 'propertyServices', '$mdSidenav', '$rootScope', 'placesOfInterestServices', 'ON_PROPERTY_FILTER_RESULT', 'PROPERTY_MARKER_SELECTED', operationsPageController]);

    function operationsPageController($scope, propertyServices, $mdSidenav, $rootScope, placesOfInterestServices, ON_PROPERTY_FILTER_RESULT, PROPERTY_MARKER_SELECTED) {
        var vm = this;

        var panelId = 'poiPanel';

        $scope.propertySelectedId = null;

        $scope.onListItemClick = onListItemClick;
        vm.showPOIPanel = showPOIPanel;


        function onListItemClick(item) {
            $scope.propertySelectedId = item.id;
            propertyServices.highlightProperty(item.id);
        }

        function showPOIPanel () {
            $mdSidenav(panelId)
                .toggle();
        }

        function cleanUp() {
            placesOfInterestServices.resetData();
            propertyServices.reset(true);
        }

        function initialize () {
            $rootScope.$on(ON_PROPERTY_FILTER_RESULT, function (e) {
                if (!$mdSidenav(panelId).isOpen()) showPOIPanel();
            });

            $rootScope.$on(PROPERTY_MARKER_SELECTED, function (e, params) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.propertySelectedId = params.propertyid;
                    });
                } else {
                    $scope.propertySelectedId = params.propertyid;
                }

                propertyServices.highlightProperty(params.propertyid, true);

                var container = $('.property-list md-list'),
                    scrollTo = $('.property-list md-list md-list-item#property-item-' + params.propertyid);

                var scrollToValue = scrollTo.offset().top - container.offset().top + container.scrollTop();

                container.animate({
                    scrollTop: scrollToValue
                }, 1500);
            });

            $scope.$on('$destroy', cleanUp);
        }

        initialize();
    }
}());