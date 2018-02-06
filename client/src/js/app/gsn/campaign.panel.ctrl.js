(function(){
'use strict';

angular.module('demoApp.gsn')
    .controller('campaignPanelController', ['$mdSidenav', '$scope', '$rootScope', '$timeout', 'GSN_TYPES', 'ON_PROPERTY_FILTER_RESULT', 'gsnServices', campaignPanelController]);

    function campaignPanelController ($mdSidenav, $scope, $rootScope, $timeout, GSN_TYPES, ON_PROPERTY_FILTER_RESULT, gsnServices) {
        var vm = this;

        var isInitialLoad = true;
        var defaultSelected = ['campaign', 'sales'];

        vm.onClickGSNItem = onClickGSNItem;
        vm.reload = reload;
        vm.closeSidenav = closeSidenav;


        function onClickGSNItem(item) {
            console.log('onClickGSNItem: ',item);
            // show marker
        }

        function getGSNData (types) {
            gsnServices.getGSNByTypes(types);
        }

        function reload() {
            getGSNData(_.filter(vm.gsnOptionTypes, function (item) {
                return item.isSelected;
            }).map(function(i){ return i.type; }));
        }

        function closeSidenav() {
            $mdSidenav('campaignPanel')
                .close();
        }

        function initialize () {
            vm.gsnOptionTypes = GSN_TYPES.map(function (item) {
                item.isSelected = defaultSelected.indexOf(item.type) > -1;
                return item;
            });

            $timeout(function () {
                isInitialLoad = false;
            }, 500);

            $rootScope.$on(ON_PROPERTY_FILTER_RESULT, function(e, result){
                // get campaigns data
                // show it on map
                getGSNData(_.filter(vm.gsnOptionTypes, function (item) {
                    return item.isSelected;
                }).map(function (i) {
                    return i.type;
                }));
            });

            $scope.$watch(function(){
                return vm.gsnOptionTypes;
            }, function(newArray) {
                console.log('watch gsnoption types: ',newArray);
              if (!newArray || newArray.length <= 0 || isInitialLoad) return;

              reload();
            }, true);
        }

        initialize();
    }
}());