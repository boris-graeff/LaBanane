/**
 * Controle for dialog
 */
angular.module('LaBanane').
    controller('DialogCtrl', ['$scope', '$rootScope', 'constants',
        function ($scope, $rootScope, constants) {

            // Init
            $scope.open = false;
            var unclosable = false;

            // Wait for instructions on rootScope
            $rootScope.$on(constants.EVENTS.OPEN_DIALOG, function(event, args) {
                show(args);
            });

            /**
             * Show dialog
             * @param options
             */
            function show(options) {
                if(options){
                    $scope.title = options.title;
                    $scope.content = options.content;
                    $scope.type = options.type;
                    $scope.onConfirm = options.onConfirm;

                    unclosable = options.type === 'unclosable';
                }
                $scope.open = true;
            }

            /**
             * Hide dialog
             */
            $scope.hide = function () {
                if(! unclosable){
                    $scope.open = false;
                }
            };

        }]);
