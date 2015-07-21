/**
 * Controle for homepage
 */
angular.module('LaBanane').
    controller('HomeCtrl', ['$scope', 'localStorage', 'requests', '$location', '$rootScope', 'constants',
        function ($scope, localStorage, requests, $location, $rootScope, constants) {

            // Init

            $scope.isPlaylistCreation = false;
            $scope.isPlaylistSearch = true;
            $scope.allPlaylists = [];
            $scope.playlist = {
                name: '',
                password: ''
            };

            var popins = {
                unavailable_name : {
                    title: "Sorry",
                    content: "This name is already taken. : (",
                    type: 'simple'
                }
            };

            $scope.lastPlaylists = localStorage.getArray('lastPlaylists');


            // Get all playlists from server

            requests.getAllPlaylists().then(
                function (playlists) {
                    $scope.allPlaylists = playlists;
                }
            );

            // Functions

            $scope.createPlaylistMode = function () {
                $scope.isPlaylistCreation = true;
                $scope.isPlaylistSearch = false;
            };

            $scope.searchPlaylistMode = function () {
                $scope.isPlaylistCreation = false;
                $scope.isPlaylistSearch = true;
            };

            $scope.createPlaylist = function () {
                var name = $scope.playlist.name;
                var password = $scope.playlist.password;
                var id = name.toLowerCase();

                requests.createPlaylist(name, password).then(
                    function onSuccess() {
                        // Save password on localStorage
                        localStorage.push('passwords', id, password);
                        // Go to player
                        $location.path('/player/' + name).replace();
                    },
                    function onError() {
                        $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, popins.unavailable_name);
                    }
                );
            };
        }]);
