angular.module('LaBanane.services')
    .factory('requests', ['$http', 'dialogHelper', function ($http, dialogHelper) {

        return {
            getAllPlaylists : getAllPlaylists,
            getPlaylist     : getPlaylist,
            createPlaylist  : createPlaylist,
            clonePlaylist   : clonePlaylist
        };

        // Public methods

        function getAllPlaylists() {
            var request = $http({
                method  : 'get',
                url     : 'services/playlist/all'
            });

            return request.then(handleSuccess, handleError);
        }

        function getPlaylist(name, password) {
            var request = $http({
                method  : 'get',
                url     : 'services/playlist/content/' + name + '/' + password
            });

            return request.then(handleSuccess, handleError);
        }

        function createPlaylist(name, password) {
            var request = $http({
                method  : 'post',
                url     : 'services/playlist/create',
                data    : {
                    name        : name,
                    password    : password
                }
            });

            return request.then(handleSuccess, handleError);
        }

        function clonePlaylist(name, password, content) {
            var request = $http({
               method   : 'post',
                url     : 'services/playlist/clone',
                data    : {
                    name        : name,
                    password    : password,
                    content     : content
                }
            });

            return request.then(handleSuccess, handleError);
        }

        // Private methods

        function handleError(response) {
            dialogHelper.openDialogUnexpectedError();
            return ($q.reject("Unexpected error :("));
        }

        function handleSuccess(response) {
            return response.data;
        }
    }]);