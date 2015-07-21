angular.module('LaBanane.services')
    .factory('requests', ['$http', function ($http) {

        return {
            getAllPlaylists: getAllPlaylists,
            getPlaylist: getPlaylist,
            createPlaylist: createPlaylist
        };

        // Public methods

        function getAllPlaylists() {
            var request = $http({
                method: 'get',
                url: 'services/playlist/all'
            });

            return request.then(handleSuccess, handleError);
        }

        function getPlaylist(name, password) {
            var request = $http({
                method: 'get',
                url: 'services/playlist/content/' + name + '/' + password
            });

            return request.then(handleSuccess, handleError);
        }

        function createPlaylist(name, password) {
            var request = $http({
                method: 'post',
                url: 'services/playlist/create',
                data: {
                    name: name,
                    password: password
                }
            });

            return request.then(handleSuccess, handleError);
        }

        // Private methods

        function handleError(response) {
            // Server error, normalize format
            if (!angular.isObject(response.data) || !response.data.message) {

                return( $q.reject("An unknown error occurred.") );

            }

            // Otherwise, use expected error message.
            return( $q.reject(response.data.message) );
        }

        function handleSuccess(response) {
            return response.data;
        }
    }]);