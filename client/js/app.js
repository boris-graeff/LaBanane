angular.module('LaBanane.controllers', []);
angular.module('LaBanane.services', []);

angular.module('LaBanane', [
    'LaBanane.controllers',
    'LaBanane.services',
    'LaBanane.directives',
    'LaBanane.constants',

    // 3rd party dependencies
    'btford.socket-io',
    'ngRoute',
    'ngAnimate',
    'ngTouch'
]).

    // Routing
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/app', {
                templateUrl: 'partials/home',
                controller: 'HomeCtrl'
            }).
            when('/player/:name', {
                templateUrl: 'partials/player',
                controller: 'PlayerCtrl'
            }).
            otherwise({
                redirectTo: '/app'
            });

        $locationProvider.html5Mode(true);
    }])

    // Google analytics requests
    .run(['$rootScope', '$location', function ($rootScope, $location) {
        $rootScope.$watch(function () {
                return $location.path();
            },
            function (url) {
                ga('send', 'pageview', {
                    page: url
                });
            });
    }]);
