angular.module('LaBanane.constants', [])

    .constant('constants', {
        PUBLIC_BASE_URL: 'http://labanane.no-ip.info/',
        YOUTUBE_KEY: "AIzaSyB726S1o_xDZs6tFiaYsFlCyIz3Bud8EQQ",
        SOUNDCLOUD_KEY: "6861ae963e16b9bbb0d5572047aecc2f",
        MAX_RESULTS: 30,
        MAX_VISITED_PLAYLISTS: 10,
        MAX_PLAYLISTS_DISPLAYED : 20,
        MAX_PLAYLIST_NAME_LENGTH : 100,

        EVENTS : {
            OPEN_DIALOG: "OPEN_DIALOG",
            CLOSE_DIALOG: "CLOSE_DIALOG",
            TRACK_END: "TRACK_END",
            TRACK_PROGRESS: "TRACK_PROGRESS"
        }
    });