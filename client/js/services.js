/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('LaBanane.services', []).

    factory('socket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }]).
    factory('localStorage', [function () {
        var localStorage = {};

        localStorage.getArray = function (item) {
            var array = window.localStorage.getItem(item);
            return array ? JSON.parse(array) : [];
        };

        return localStorage;
    }]).


    factory('requests', ['$http', function ($http) {
        var requests = {};
        requests.getAllPlaylists = function () {
            return $http.get('services/playlist/all');
        };

        requests.getPlaylist = function (id, password) {
            return $http.get('services/playlist/content/' + id + '/' + password);
        };

        return requests;
    }]);
