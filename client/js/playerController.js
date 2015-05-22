/**
 * Controle for player page
 */
angular.module('LaBanane').
  controller('PlayerCtrl', ['$scope', 'localStorage', 'requests', function ($scope, localStorage, requests) {

        // Init

        $scope.currentTrack = {
            'name' : 'Radiohead - Go to hell'
        };

        var mock = [
            {
                'name': 'fqsfsdf'
            },
            {
                'name': 'sfqsfqsfqsf'
            },
            {
                'name': 'dgsdgsdg'
            },
            {
                'name': 'zeesdgsdgsdg'
            }
        ];

        $scope.playlist = mock;

        $scope.results = mock;

        $scope.isYoutubeProvider = false;
        $scope.isSoundcloudProvider = true;

        // Get playlist from server
        /*
        requests.getPlaylist('id', 'password').then(function(playlist){
            $scope.playlist = playlist;
        });
        */

        // Functions


  }]);
