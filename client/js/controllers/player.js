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
                progress : 0
            };

            $scope.controls = {
                volume: 100,
                volumeBeforeBeingMuted: 100,
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


            // Track progress
            $rootScope.$on(constants.EVENTS.TRACK_PROGRESS, function (event, progress) {
                console.log(progress);

                $scope.$apply($scope.currentTrack.progress = progress);
            });

            // End of the track
            $rootScope.$on(constants.EVENTS.TRACK_END, function () {
                $scope.next();
                $scope.$apply();
            });


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
                    player.setVolume(volume);

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

            $scope.setVolume = function (value) {
                if(player){
                    player.setVolume(value);
                }
                $scope.controls.volume = value;
            };

            $scope.seek = function (percentage) {
                if(player){
                    player.seek(percentage);
                }
            };

            $scope.mute = function () {
                $scope.controls.volumeBeforeBeingMuted = $scope.controls.volume;
                $scope.controls.isMuted = true;
                $scope.setVolume(0);
            };

            $scope.unmute = function () {
                $scope.controls.isMuted = false;
                $scope.setVolume($scope.controls.volumeBeforeBeingMuted);
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

            $scope.moveToPlaylistEnd = function (trackIndex) {
                var track = $scope.playlist.content[trackIndex];
                $scope.playlist.content.splice(trackIndex, 1);
                $scope.playlist.content.push(track);

                var currentTrack = $scope.currentTrack;

                if (currentTrack.index) {
                    if (trackIndex === currentTrack.index) {
                        $scope.currentTrack.index = $scope.playlist.content.length - 1;
                    }
                    else if (trackIndex < currentTrack.index) {
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
