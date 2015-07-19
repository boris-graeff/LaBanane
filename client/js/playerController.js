/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('PlayerCtrl', ['$scope', 'localStorage', 'requests', '$routeParams', 'constants', '$rootScope',
        function ($scope, localStorage, requests, $routeParams, constants, $rootScope) {

            // Init
            var playlistId = $routeParams.id;
            var password = localStorage.getValue('passwords', playlistId);

            var popins = {
                unknown_playlist : {
                    title   : "Sorry",
                    content : "The playlist doesn't exist anymore. : (",
                    type    : 'unclosable'
                }
            };

            $scope.playlist = {
                id: playlistId,
                owner: false,
                currenTrack: {},
                content : []
            };

            $scope.controls = {
                volume: 100,
                isPlaying: false,
                isMuted: false,
                isShuffleMode: false
            };

            // TODO : clear
            $scope.playlist.currentTrack = {
                'name': 'Radiohead - Go to hell'
            };

            var mock = [
                {
                    'name': '1'
                },
                {
                    'name': '2'
                },
                {
                    'name': '3'
                },
                {
                    'name': '4'
                },
                {
                    'name': '5'
                }
            ];

            // Get playlist from server

            requests.getPlaylist(playlistId, password)
                .then(
                function onSuccess(data) {
                    $scope.playlist.content = data.playlist;
                    $scope.playlist.owner = data.auth;
                    // TODO
                    //$scope.playlist.content = mock;

                    // Save visit in localstorage
                    localStorage.pushTemp('lastPlaylists', playlistId, constants.MAX_VISITED_PLAYLISTS);
                },
                function onError() {
                    $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, popins.unknown_playlist);
                }
            );


            // Scope functions

            $scope.addSongToPlaylistEnd = function (trackInfo) {
                $scope.playlist.content.push(trackInfo);
            };

            $scope.addSongToPlaylist = function(index, trackInfo) {
                $scope.playlist.content.splice(index, 0, trackInfo);
            };

            $scope.moveSong = function (index1, index2) {
                var track = $scope.playlist.content[index1];

                $scope.playlist.content.splice(index1, 1);
                $scope.playlist.content.splice(index2, 0, track);

                var currentTrack = $scope.playlist.currentTrack;

                if (currentTrack) {
                    if (index1 == currentTrack.index) {
                        $scope.currentTrack.index = index2;
                    }
                    else if (index1 < currentTrack.index && index2 >= currentTrack.index) {
                        $scope.currentTrack.index -= 1;
                    }
                    else if (index1 > currentTrack.index && index2 <= currentTrack.index) {
                        $scope.currentTrack.index += 1;
                    }
                }
            }

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
                if ($scope.playlist.currenTrack) {
                    if ($scope.controls.isShuffleMode) {
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
                if ($scope.playlist.currenTrack) {
                    if ($scope.controls.isShuffleMode) {
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
                $scope.playlist.currentTrack = {};
            }



        }]);
