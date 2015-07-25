angular.module('LaBanane.services')
    .factory('dialogHelper', ['$rootScope', 'constants', function ($rootScope, constants) {

        var dialogs = {
            UNAVAILABLE_NAME : {
                title   : "Sorry",
                content : "This name is already taken. : (",
                type    : 'simple'
            },
            UNKNOWN_PLAYLIST : {
                title   : "Sorry",
                content : "The playlist doesn't exist. : (",
                type    : 'unclosable'
            },
            UNEXPECTED_ERROR : {
                title   : 'Sorry',
                content : "An unexpected error has occurred...",
                type    : 'unclosable'
            },
            CLEAR_PLAYLIST : {
                title   : "Hey",
                content : "Are you sure you want to clear this playlist ?",
                type    : 'confirm'
            },
            AUTH : {
                title   : "Authentication",
                content : "<p>Please, type password for this playlist</p><div class='input-container'><input id='playlist-password' type='password' ng-model='param' autocomplete='off' input-text><label for='playlist-password'>Password</label></div>",
                type    : 'confirm'
            },
            AUTH_ERROR : {
                title   : "Error",
                content : "<p>Bad password. Try again.</p><div class='input-container'><input id='playlist-password' type='password' ng-model='param' autocomplete='off' input-text><label for='playlist-password'>Password</label></div>",
                type    : 'confirm'
            },
            CLONE : {
                title   : "Clone",
                content : "<p>Choose a name and a password for this playlist</p><div class='input-container'><input id='playlist-name' type='text' ng-model='param.name' autocomplete='off' input-text><label for='playlist-name'>Name</label></div><div class='input-container'><input id='playlist-password' type='password' ng-model='param.password' autocomplete='off' input-text><label for='playlist-password'>Password</label></div>",
                type    : 'confirm'
            },
            CLONE_ERROR : {
                title   : "Clone",
                content : "<p>This name is already taken, please choose another one</p><div class='input-container'><input id='playlist-name' type='text' ng-model='param.name' autocomplete='off' input-text><label for='playlist-name'>Name</label></div><div class='input-container'><input id='playlist-password' type='password' ng-model='param.password' autocomplete='off' input-text><label for='playlist-password'>Password</label></div>",
                type    : 'confirm'
            }
        };

        return {
            openDialogUnavailableName   : openDialogUnavailableName,
            opendDialogUnknownPlaylist  : opendDialogUnknownPlaylist,
            openDialogClone             : openDialogClone,
            openDialogCloneError        : openDialogCloneError,
            openDialogAuth              : openDialogAuth,
            openDialogAuthError         : openDialogAuthError,
            openDialogClearPlaylist     : openDialogClearPlaylist,
            openDialogUnexpectedError   : openDialogUnexpectedError,
            closeDialog                 : closeDialog
        };

        // Methods


        function openDialogUnavailableName () {
            openDialog(dialogs.UNAVAILABLE_NAME);
        }

        function opendDialogUnknownPlaylist () {
            openDialog(dialogs.UNKNOWN_PLAYLIST);
        }

        function openDialogCloneError (callback) {
            openDialog(dialogs.CLONE_ERROR, callback);
        }

        function openDialogAuthError (callback) {
            openDialog(dialogs.AUTH_ERROR, callback);
        }

        function openDialogAuth (callback) {
            openDialog(dialogs.AUTH, callback);
        }

        function openDialogClone (callback) {
            openDialog(dialogs.CLONE, callback);
        }

        function openDialogClearPlaylist (callback) {
            openDialog(dialogs.CLEAR_PLAYLIST, callback);
        }

        function openDialogUnexpectedError () {
            openDialog(dialogs.UNEXPECTED_ERROR);
        }

        /**
         *
         * @param content
         * @param callback
         */
        function openDialog(content, callback) {
            content.callback = callback;
            $rootScope.$emit(constants.EVENTS.OPEN_DIALOG, content);
        }

        /**
         *
         */
        function closeDialog() {
            $rootScope.$emit(constants.EVENTS.CLOSE_DIALOG);
        }

    }]);