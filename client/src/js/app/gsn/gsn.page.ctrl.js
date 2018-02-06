(function(){
'use strict';

angular.module('demoApp.gsn')
    .controller('gsnPageController', ['$scope', '$rootScope', 'propertyServices', '$mdSidenav', 'ON_PROPERTY_FILTER_RESULT', 'PROPERTY_MARKER_SELECTED', 'gmapServices', 'gsnServices', gsnPageController]);

    function gsnPageController($scope, $rootScope, propertyServices, $mdSidenav, ON_PROPERTY_FILTER_RESULT, PROPERTY_MARKER_SELECTED, gmapServices, gsnServices) {
        var vm = this;

        var panelId = 'campaignPanel';

        $scope.propertySelectedId = null;


        vm.toggleCampaignPanel = toggleCampaignPanel;
        $scope.onListItemClick = onListItemClick;

        function toggleCampaignPanel () {
            $mdSidenav(panelId)
                .toggle();
        }

        function onListItemClick(item) {
            $scope.propertySelectedId = item.id;
            propertyServices.highlightProperty(item.id);
        }

        function cleanUp() {
            gsnServices.resetData();
            propertyServices.reset(true);
        }

        function initialize () {
            $rootScope.$on(ON_PROPERTY_FILTER_RESULT, function (e) {
                if (!$mdSidenav(panelId).isOpen()) toggleCampaignPanel();
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

            //gmapServices.addMapListener('click', function(e){
            //    console.log('latlng: ', JSON.stringify(e.latLng.toJSON()));
            //});
        }

        initialize();
    }
}());