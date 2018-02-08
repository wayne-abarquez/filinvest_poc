(function(){
'use strict';

angular.module('demoApp.home')
    .controller('indexController', ['$rootScope', indexController]);

    function indexController ($rootScope) {
        var vm = this;

        $rootScope.lots = [];
        $rootScope.condoUnits = [];

        vm.soldLotsCtr = 0;
        vm.progressProjectsCtr = 0;

        /* Chart Vars */

        vm.projectPieChart = {
            currentKpiType: null,
            selectedDate: '',
            showLoading: false,
            labels: [],
            data: []
        };

        vm.projectLineChart = {
            currentProject: null,
            currentKpiType: '',
            selectedDate: null,
            showLoading: false,
            labels: [],
            series: ['actual', 'target'],
            data: []
        };

        // vm.openMenu = openMenu;
        // vm.onPieChartClick = onPieChartClick;
        // vm.onLineChartClick = onLineChartClick;
        //
        // vm.changeProject = changeProject;
        // vm.changeKPIType = changeKPIType;
        // vm.refreshLineChart = refreshLineChart;
        //
        // vm.changePieKPIType = changePieKPIType;
        // vm.refreshPieChart = refreshPieChart;


        function initialize() {
            console.log('indexController init');
        }

        initialize();
    }

}());