(function () {
    'use strict';

    angular
        .module('demoApp.selling', [])

        .constant('PROPERTY_TYPES', ['commercial', 'condominium', 'hotel', 'mall', 'housing', 'recreation', 'school', 'hospital'])



        .constant('PROPERTY_LOCATION', ['alabang'])
    ;

}());
