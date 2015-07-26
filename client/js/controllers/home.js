/**
 * Controle for homepage
 */
angular.module('LaBanane').
    controller('HomeCtrl', ['$scope', 'localStorage', 'requests', '$location', 'constants', 'dialogHelper',
        function ($scope, localStorage, requests, $location, constants, dialogHelper) {

            // Init

            $scope.isPlaylistCreation = false;
            $scope.maxPlaylistsDisplayed = constants.MAX_PLAYLISTS_DISPLAYED;
            $scope.isPlaylistSearch = true;
            $scope.allPlaylists = [];
            $scope.playlist = {
                name: '',
                password: ''
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

                requests.createPlaylist(name, password).then(
                    function onSuccess(response) {
                        if(response.available){
                            // Save password on localStorage
                            localStorage.push('passwords', name, password);
                            // Go to player
                            $location.path('/player/' + name).replace();
                        }
                        else {
                            dialogHelper.openDialogUnavailableName();
                        }
                    }
                );
            };
        }]);
