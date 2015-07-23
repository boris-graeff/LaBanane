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
                    content :  "<p>Please, type password for this playlist</p>" +
                        "<div class='input-container'><input type='password' ng-model='param'></div>",
                    type    : 'confirm',
                    onConfirm   : doAuthentication
                },
                bad_password : {
                    title   : "Error",
                    content :  "<p>Bad password. Try again.</p>" +
                        "<div class='input-container'><input type='password' ng-model='param'></div>",
                    type    : 'confirm',
                    onConfirm   : doAuthentication
                }
            };

            $scope.playlist = {
                name: playlistName,
                owner: false,
                content : []
            };

            $scope.currentTrack = {
                name : ' ',
                index : null,
                progress : 50
                //progress : 0
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

            // Events

            $rootScope.$on('service.timeUpdate', function (event, data) {
                $scope.currentTrack.progress = data * 600;
            });

            // Song end
            /*
            $rootScope.$on('service.songEnd', function () {
                $scope.next();
                $scope.$apply();
            });

            // Loading error
            $rootScope.$on('service.loadingError', function () {
                $scope.$apply($scope.remove($scope.currentTrack.index));
                $scope.play($scope.currentTrack.index);
            });
            */


            // Player functions


            $scope.play = function (index) {
                if (index !== undefined && index !== null && $scope.playlist.content[0] !== undefined) {
                    var track = $scope.playlist.content[index];
                    if (track === undefined) {
                        track = $scope.playlist.content[0];
                        index = 0;
                    }

                    $scope.pause();

                    console.log(track);

                    if (track.provider === 'youtube') {
                        player = youtube;
                    }
                    else if (track.provider === 'soundcloud') {
                        player= soundcloud;
                    }

                    $scope.currentTrack = {
                        name   : track.name,
                        index   : index
                    };

                    player.loadSong(track.id).then(function () {
                        player.play();
                        $scope.controls.isPlaying = true;
                    });

                }
                else if ($scope.currentTrack.index !== null) {
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
                if ($scope.currentTrack) {
                    if ($scope.controls.isShuffleMode) {
                        $scope.play(getRandomTrackId());
                    }
                    else {
                        var prevTrackId = $scope.currentTrack.index - 1;
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
                if ($scope.currentTrack) {
                    if ($scope.controls.isShuffleMode) {
                        $scope.play(getRandomTrackId());
                    }
                    else {
                        var nextTrackId = $scope.currentTrack.index + 1;
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
                console.log("seek "+position);
                if(player){
                    player.seek(position);
                }
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
                $scope.pause();
                $scope.seek(0);
                $scope.currentTrack = {
                    name : ' ',
                    index : null
                };
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

                var track = $scope.playlist.content[index1];

                $scope.playlist.content.splice(index1, 1);
                $scope.playlist.content.splice(index2, 0, track);

                var currentTrackIndex = $scope.currentTrack.index;

                if (currentTrackIndex !== null) {
                    if (index1 === currentTrackIndex) {
                        $scope.currentTrack.index = index2;
                    }
                    else if (index1 < currentTrackIndex && index2 >= currentTrackIndex) {
                        $scope.currentTrack.index -= 1;
                    }
                    else if (index1 > currentTrackIndex && index2 <= currentTrackIndex) {
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

                var currentTrackIndex = $scope.currentTrack.index;

                if(currentTrackIndex !== null){
                    if (currentTrackIndex > index) {
                        $scope.currentTrack.index = currentTrackIndex - 1;
                    }
                    else if (currentTrackIndex === index) {
                        $scope.stop();
                        $scope.play(index);
                    }
                }
            };

            $scope.moveToPlaylistEnd = function (trackIdPlaylist) {
                var song = $scope.playlistSongs[trackIdPlaylist];
                $scope.playlistSongs.splice(trackIdPlaylist, 1);
                $scope.playlistSongs.push(song);

                var currentTrack = $scope.currentTrack;
                if (currentTrack) {
                    if (trackIdPlaylist == currentTrack.index) {
                        $scope.currentTrack.index = $scope.playlistSongs.length - 1;
                    }
                    else if (trackIdPlaylist < currentTrack.index) {
                        $scope.currentTrack.index -= 1;
                    }
                }
                update();
            }

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
                $rootScope.$emit(constants.EVENTS.CLOSE_DIALOG);
            }

            /**
             * Perform authentication
             */
            function doAuthentication($dialogScope) {

                var password = $dialogScope.param;

                if(password){
                    $dialogScope.param = '';
                    requests.getPlaylist(playlistName, password)
                        .then(
                        function onSuccess(data) {
                            $scope.playlist.content = data.playlist;
                            $scope.playlist.owner = data.auth;

                            // Save password on localStorage
                            localStorage.push('passwords', playlistName, password);

                            $rootScope.$emit(constants.EVENTS.CLOSE_DIALOG);
                        },
                        function onError() {
                            $rootScope.$emit(constants.EVENTS.CLOSE_DIALOG);
                            $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, dialogs.bad_password);
                        }
                    );
                }
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
