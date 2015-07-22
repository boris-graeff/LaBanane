/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('PlayerCtrl', ['$scope', 'localStorage', 'requests', '$routeParams', 'constants', '$rootScope', 'socket', 'soundcloud', 'youtube',
        function ($scope, localStorage, requests, $routeParams, constants, $rootScope, socket, soundcloud, youtube) {

            // Init
            var playlistName = $routeParams.name;
            var playlistPassword = localStorage.getValue('passwords', playlistName);
            var player = null;

            var dialogs = {
                unknown_playlist : {
                    title   : "Sorry",
                    content : "The playlist doesn't exist anymore. : (",
                    type    : 'unclosable'
                },
                confirm_clear_playlist : {
                    title       : "Hey",
                    content     : "Are you sure you want to clear this playlist ?",
                    type        : 'confirm',
                    onConfirm   : clearPlaylist
                },
                do_auth : {
                    title   : "Authentication",
                    content : "<p>Please, type password for this playlist</p><input type='password' />",
                    type    : 'confirm',
                    onConfirm   : doAuthentication
                }
            };

            $scope.playlist = {
                name: playlistName,
                owner: false,
                currentTrack: {},
                content : []
            };

            $scope.controls = {
                volume: 100,
                isPlaying: false,
                isMuted: false,
                isShuffleMode: false
            };

            // Get playlist from server

            requests.getPlaylist(playlistName, playlistPassword)
                .then(
                function onSuccess(data) {
                    $scope.playlist.content = data.playlist;
                    $scope.playlist.owner = data.auth;

                    // Save visit in localstorage
                    localStorage.pushTemp('lastPlaylists', playlistName, constants.MAX_VISITED_PLAYLISTS);
                },
                function onError() {
                    $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, dialogs.unknown_playlist);
                }
            );


            // Player functions


            $scope.play = function (index) {
                if (index !== undefined && index !== null && $scope.playlist.content[0] !== undefined) {
                    var track = $scope.playlist.content[index];
                    if (track === undefined) {
                        track = $scope.playlist.content[0];
                        index = 0;
                    }

                    $scope.pause();

                    if (track.provider === 'youtube') {
                        player = youtube;
                    }
                    else if (track.provider === 'soundcloud') {
                        player= soundcloud;
                    }

                    $scope.playlist.currentTrack = {
                        track   : track,
                        index   : index
                    };

                    player.loadSong(track.id).then(function () {
                        player.play();
                        $scope.controls.isPlaying = true;
                    });

                }
                else if ($scope.playlist.currentTrack !== null) {
                    player.play();
                    $scope.controls.isPlaying = true;
                }

                else if ($scope.playlist.content[0] !== undefined) {
                    $scope.play(0);
                }
            };

            $scope.pause = function () {
                if(player){
                    player.pause();
                    $scope.controls.isPlaying = false;
                }
            };

            $scope.previous = function () {
                if ($scope.playlist.currentTrack) {
                    if ($scope.controls.isShuffleMode) {
                        $scope.play(getRandomTrackId());
                    }
                    else {
                        var prevTrackId = $scope.playlist.currentTrack.index - 1;
                        var playlistLength = $scope.playlist.content.length;

                        if (prevTrackId < 0) {
                            $scope.play(playlistLength - 1);
                        }
                        else if (prevTrackId < playlistLength) {
                            $scope.play(prevTrackId);
                        }
                    }
                }
            };

            $scope.next = function () {
                if ($scope.playlist.currentTrack) {
                    if ($scope.controls.isShuffleMode) {
                        $scope.play(getRandomTrackId());
                    }
                    else {
                        var nextTrackId = $scope.playlist.currentTrack.index + 1;
                        var playlistLength = $scope.playlist.content.length;

                        if (nextTrackId > playlistLength) {
                            $scope.play(0);
                        }
                        else if (nextTrackId >= 0) {
                            $scope.play(nextTrackId);
                        }
                    }
                }
            };

            $scope.toggleShuffleMode = function () {
                $scope.controls.isShuffleMode = !$scope.controls.isShuffleMode;
            };

            $scope.setVolume = function (volume) {
                player.setVolume(volume);
            };

            $scope.seek = function (position) {
                player.seek(position);
            };

            $scope.mute = function () {
                $scope.controls.isMuted = true;
                $scope.volume = player.getVolume();

                $scope.setVolume(0);
            };

            $scope.unmute = function () {
                $scope.controls.isMuted = false;
                $scope.setVolume($scope.volume);
            };

            $scope.stop = function () {
                pause();
                $scope.seek(0);
                $scope.playlist.currentTrack = {};
            };


            // Playlist functions


            $scope.addSongToPlaylistEnd = function (trackInfo) {
                $scope.playlist.content.push(trackInfo);
                update();
            };

            $scope.addSongToPlaylist = function(index, trackInfo) {
                $scope.playlist.content.splice(index, 0, trackInfo);
                update();
            };

            $scope.moveSong = function (index1, index2) {

                console.log('movesong');
                console.log(index1);
                console.log(index2);
                var track = $scope.playlist.content[index1];

                $scope.playlist.content.splice(index1, 1);
                $scope.playlist.content.splice(index2, 0, track);

                var currentTrack = $scope.playlist.currentTrack;

                if (currentTrack) {
                    if (index1 === currentTrack.index) {
                        $scope.currentTrack.index = index2;
                    }
                    else if (index1 < currentTrack.index && index2 >= currentTrack.index) {
                        $scope.currentTrack.index -= 1;
                    }
                    else if (index1 > currentTrack.index && index2 <= currentTrack.index) {
                        $scope.currentTrack.index += 1;
                    }
                }

                update();
            };

            $scope.confirmClearPlaylist = function () {
                $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, dialogs.confirm_clear_playlist);
            };

            $scope.remove = function(index) {
                console.log('removeTrack');
                console.log(index);

                $scope.playlist.content.splice(index, 1);

                update();

                var currentTrack = $scope.playlist.currentTrack;

                if(currentTrack){
                    if (currentTrack.index > index) {
                        $scope.currentTrack.index = currentTrackIndex - 1;
                    }
                    else if (currentTrack.index === index) {
                        $scope.stop();
                        $scope.play(index);
                    }
                }
            };

            $scope.authentication = function () {
                $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, dialogs.do_auth);
            };

            // Privates functions

            /**
             * Clear playlist
             */
            function clearPlaylist() {
                $scope.playlist.content.length = 0;
                $scope.stop();
                update();
            }

            /**
             * Perform authentication
             */
            function doAuthentication() {
                console.log('doAuth');
            }

            /**
             * Get random track id
             * @returns {number}
             */
            function getRandomTrackId() {
                return Math.floor(Math.random() * $scope.playlist.content.length);
            }


            /**
             * Send playlist state to server
             */
            function update() {
                if ($scope.playlist.owner) {
                    socket.emit("message", {
                        action: 'update',
                        room: playlistName,
                        param: {
                            playlist    : $scope.playlist.content,
                            password    : playlistPassword
                        }
                    });
                }
            }

        }]);
