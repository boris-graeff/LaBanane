/**
 * Controle for homepage
 */
angular.module('LaBanane').
  controller('HomeCtrl', ['$scope', 'localStorage', 'requests', function ($scope, localStorage, requests) {

        // Init

        $scope.isPlaylistCreation = false;
        $scope.isPlaylistSearch = true;
        $scope.lastPlaylists = localStorage.getArray('lastPlaylists');
        $scope.allPlaylists = [];


        /*

         $scope.allPlaylists = data;
         }).
         error(function(data, status, headers, config) {
         // TODO : display popin
         });
         */

        // Get all playlists from server
        requests.getAllPlaylists().success(function(data) {
            $scope.allPlaylists = data;
        }).
        error(function(data, status, headers, config) {
                // TODO : display popin
        });

        // Functions

        $scope.createPlaylist = function(){
            $scope.isPlaylistCreation = true;
            $scope.isPlaylistSearch = false;
        };

        $scope.searchPlaylist = function(){
            $scope.isPlaylistCreation = false;
            $scope.isPlaylistSearch = true;
        };
  }]);
