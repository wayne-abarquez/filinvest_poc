(function () {
    'use strict';

    angular.module('demoApp')
        .controller('mainController', ['$rootScope', 'APP_NAME', '$mdSidenav', mainController]);

    function mainController($rootScope, APP_NAME, $mdSidenav) {
        var vm = this;

        var originatorEv;

        $rootScope.currentUser = {
            username: 'admin',
            role: 'admin'
        };

        $rootScope.appName = APP_NAME;

        /* Side Nav Menus */
        vm.menu = [
            {
                state: 'home',
                title: 'Home',
                icon: 'home'
            },
            {
                state: 'map.selling',
                title: 'Selling',
                icon: 'local_atm'
            },
            {
                state: 'map.estateMgmt',
                title: 'Estate Mgmt',
                icon: 'account_balance'
            },
            //{
            //    state: 'property-mgmt',
            //    title: 'Property Mgmt',
            //    icon: 'store_mall_directory'
            //},
            //{
            //    state: 'business-dev',
            //    title: 'Business Development',
            //    icon: 'work'
            //},
            {
                state: 'map.planDesign',
                title: 'Planning and Design',
                icon: 'build',
                isToggled: false,
                children: [
                    {
                        state: 'planning-design.construction-status',
                        title: 'Construction Status',
                        icon: 'build',
                    },
                    {
                        state: 'planning-design.hazard',
                        title: 'Hazard',
                        icon: 'build',
                    }
                ]
            },
            {
                state: 'map.permits',
                title: 'Permits',
                icon: 'assignment'
            },
            {
                state: 'map.gsn',
                title: 'GSN',
                icon: 'person_pin'
            },
            {
                state: 'map.operations',
                title: 'Operations',
                icon: 'autorenew'
            }
        ];

        vm.onItemClick = onItemClick;
        vm.toggleMainMenu = buildToggler('mainMenuSidenav');
        vm.openRightMenu = openRightMenu;
        vm.logout = logout;


        function onItemClick(item) {
            item.isToggled = !item.isToggled;
            console.log('onItemClick: ', item);
        }

        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle();
            }
        }

        function openRightMenu($mdMenu, e) {
            originatorEv = e;
            $mdMenu.open(e);
        }

        function logout(e) {
            console.log('logout');
            originatorEv = null;
        }

    }
}());