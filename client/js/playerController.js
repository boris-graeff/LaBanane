/**
 * Controle for homepage
 */
angular.module('LaBanane').
  controller('HomeCtrl', ['$scope', 'localStorage', 'requests', function ($scope, localStorage, requests) {

        // Init

        $scope.isPlaylistCreation = false;
        $scope.isPlaylistSearch = true;
        $scope.lastPlaylists = localStorage.getArray('lastPlaylists');

        $scope.allPlaylists = ['dsgsdg', 'Fdsdgdg', 'aaa', 'bbbb', 'ffaaa', 'ccc', 'd', 'e', 'ffaaaddadg', 'dsdfdf', 'dssdgdg', 'dsgsdgsdgsdg'];

        requests.getAllPlaylists().then(function(playlists){
            $scope.allPlaylists = playlists;
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
