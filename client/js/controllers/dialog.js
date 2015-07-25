/**
 * Controle for dialog
 */
angular.module('LaBanane').
    controller('DialogCtrl', ['$scope', '$rootScope', 'constants', '$sce',
        function ($scope, $rootScope, constants, $sce) {

            /**
             * Dialogs types :
             * - SIMPLE
             * - UNCLOSABLE
             * - CONFIRM
             */


            // INIT


            $scope.open = false;
            var unclosable = false;

            // Wait for instructions on rootScope
            $rootScope.$on(constants.EVENTS.OPEN_DIALOG, function(event, args) {
                $scope.show(args);
            });

            $rootScope.$on(constants.EVENTS.CLOSE_DIALOG, function() {
                $scope.hide();
            });


            // FUNCTIONS


            /**
             * Show dialog
             * @param options
             */
            $scope.show = function (options) {
                $scope.param = '';
                if(options){
                    $scope.title = options.title;
                    $scope.content =  $sce.trustAsHtml(options.content);
                    $scope.type = options.type;
                    $scope.callback = options.callback;

                    unclosable = options.type === 'unclosable';
                }
                $scope.open = true;
            };

            /**
             * Hide dialog if click on cancel button or on backdrop
             */
            $scope.hide = function (event) {

                if(!event || (!unclosable && $(event.target).hasClass('close-dialog'))){
                    $scope.open = false;
                }
            };

            /**
             * Call callback with $scope as parameter
             */
            $scope.confirm = function () {
                $scope.callback($scope);
            };


        }]);
