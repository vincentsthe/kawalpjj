require.config({
    baseUrl: '/angular',
    waitSeconds: 0,
    paths: {
        angular: 'libs/angular/angular',
        angularUiRouter: 'libs/angular/angular-ui-router.min',
        chartDrawer: 'graph/chartDrawer',
        d3: 'libs/d3/d3.min',
        domReady: 'libs/domReady/domReady',
        jquery: 'libs/jquery/jquery.min'
    },

    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        },
        angularUiRouter: {
            deps: ['angular']
        },
        d3: {
            exports: 'd3',
            deps: ['jquery']
        }
    },

    deps: [
        './a_bootstrap'
    ]
});