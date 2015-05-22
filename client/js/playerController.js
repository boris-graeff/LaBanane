/**
 * Controle for player page
 */
angular.module('LaBanane').
  controller('PlayerCtrl', ['$scope', 'localStorage', 'requests', '$routeParams', function ($scope, localStorage, requests, $routeParams) {

        // Init
        var playlistId = $routeParams.id;
        $scope.playlistId = playlistId;
        var password = localStorage.getValue('passwords', playlistId);

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

        requests.getPlaylist(playlistId, password)
            .then(
                function onSuccess(){
                    $scope.playlist = playlist;
                },
                function onError(){
                    alert('ERROR : playlsit inconnue');
                }
        );

        // Functions


  }]);
