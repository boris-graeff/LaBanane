/**
 * Controle for homepage
 */
angular.module('LaBanane').
  controller('HomeCtrl', ['$scope', 'localStorage', 'requests', '$location',
        function ($scope, localStorage, requests, $location) {

        // Init

        $scope.isPlaylistCreation = false;
        $scope.isPlaylistSearch = true;
        $scope.lastPlaylists = localStorage.getArray('lastPlaylists');
        $scope.allPlaylists = [];
        $scope.playlistId = '';
        $scope.playlistPassword = '';

        /*

         $scope.allPlaylists = data;
         }).
         error(function(data, status, headers, config) {
         // TODO : display popin
         });
         */

        // Get all playlists from server

        requests.getAllPlaylists().then(
            function(playlists) {
                $scope.allPlaylists= playlists;
            }
        );

        // Functions

        $scope.createPlaylistMode = function(){
            $scope.isPlaylistCreation = true;
            $scope.isPlaylistSearch = false;
        };

        $scope.searchPlaylistMode = function(){
            $scope.isPlaylistCreation = false;
            $scope.isPlaylistSearch = true;
        };

        $scope.createPlaylist = function(){
            var id = $scope.playlistId;
            var password = $scope.playlistPassword;

            requests.createPlaylist(id, password).then(
                function onSuccess(){
                    // Save password on localStorage
                    localStorage.push('passwords', id, password);
                    // Go to player
                    $location.path('/player/' + id).replace();
                },
                function onError(){
                    console.log('error');
                }
            );
        };
  }]);
