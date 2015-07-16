/**
 * Controle for player page
 */
angular.module('LaBanane').
  controller('PlayerCtrl', ['$scope', 'localStorage', 'requests', '$routeParams', 'providers', 'constants', 'ngDialog',
        function ($scope, localStorage, requests, $routeParams, providers, constants, ngDialog) {



        // Init
        var playlistId = $routeParams.id;
        var password = localStorage.getValue('passwords', playlistId);

        $scope.playlist = {
            id : playlistId,
            owner : false,
            currenTrack : {}
        };

        $scope.controls = {
            volume : 100,
            isPlaying : false,
            isMuted : false,
            isShuffleMode : false
        };

        $scope.search = {
            provider : 'youtube'
        };


        // TODO : clear
        $scope.playlist.currentTrack = {
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
            },
            {'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'}
        ];

       // TODO $scope.search.results = mock;



        // Get playlist from server

        requests.getPlaylist(playlistId, password)
            .then(
                function onSuccess(data){
                    $scope.playlist.content = data.playlist;
                    $scope.playlist.owner = data.auth;
                    // TODO
                    $scope.playlist.content = mock;

                    // Save visit in localstorage
                    localStorage.pushTemp('lastPlaylists', playlistId, constants.MAX_VISITED_PLAYLISTS);
                },
                function onError(){
                    console.log('error');
                }
        );

        // Privates functions

        function getRandomTrackId() {
            return Math.floor(Math.random() * $scope.playlist.content.length);
        }

        function play(num) {
            player.play();
            $scope.isPlaying = true;
        }

        function pause() {
            player.pause();
            $scope.isPlaying = false;
        }

        function reset() {
            $scope.playlist.content.length = 0;
            stop();
        }

        function previous() {
            if($scope.playlist.currenTrack){
                if($scope.controls.isShuffleMode) {
                    play(getRandomTrackId());
                }
                else {
                    var prevTrackId = $scope.playlist.currentTrack.index - 1;
                    var playlistLength = $scope.playlist.content.length;

                    if (prevTrackId < 0) {
                        play(playlistLength - 1);
                    }
                    else if (prevTrackId < playlistLength) {
                        play(prevTrackId);
                    }
                }
            }
        }

        function next() {
            if($scope.playlist.currenTrack){
                if($scope.controls.isShuffleMode) {
                    play(getRandomTrackId());
                }
                else {
                    var nextTrackId = $scope.playlist.currentTrack.index + 1;
                    var playlistLength = $scope.playlist.content.length;

                    if (nextTrackId > playlistLength) {
                        play(0);
                    }
                    else if (nextTrackId >= 0) {
                        play(nextTrackId);
                    }
                }
            }
        }

        function toggleShuffleMode() {
            $scope.controls.isShuffleMode = !$scope.controls.isShuffleMode;
        }

        function setVolume(volume) {
            player.setVolume(volume);
        }

        function seek(percentage) {
            player.seek(percentage);
        }

        function mute() {
            $scope.controls.isMuted = true;
            $scope.volume = player.getVolume();

            setVolume(0);
        }

        function unmute() {
            $scope.controls.isMuted = false;
            setVolume($scope.volume);
        }

        function stop() {
            pause();
            seek(0);
            $scope.palylist.currentTrack = {};
        }

        function search () {
            var keywords = $scope.search.keywords;
            var provider = $scope.search.provider;

            if (keywords.length > 3) {
                providers.doSearchRequest(keywords).then(
                    function(results){
                        $scope.search.results = results;
                    }
                );
            }
        }



  }]);
