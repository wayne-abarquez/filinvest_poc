(function () {
    'use strict';

    angular
        .module('demoApp.planDesign', [])

        .constant('BASE_MAP_INDEXES', {
            flood: 0,
            landslide: 1,
            faultline: 2,
            stormsurge: 3
        })

        .constant('FAULTLINE_COLORS', {
            2010: '#2980b9',
            fissure: '#2ecc71',
            dash3: '#e67e22'
        })

        .constant('NOAH_GEOSERVER_BASE_URL', 'http://202.90.159.177/geoserver/wms')

        .constant('PHILVOCS_GEOSERVER_BASE_URL', 'http://faultfinder.phivolcs.dost.gov.ph/ows/wms/serve/s_37749/wms_2_37749')

    ;

}());
