(function(){
'use strict';

angular.module('demoApp.permits')
    .controller('permitsPageController', ['$scope', 'propertyServices', '$mdSidenav', permitsPageController]);

    function permitsPageController($scope, propertyServices, $mdSidenav) {
        var vm = this;

        var panelId = 'sidePanel';

        vm.toggleSidePanel = toggleSidePanel;

        function toggleSidePanel () {
            $mdSidenav(panelId)
                .toggle();
        }

        function initialize () {
        }

        initialize();
    }
}());