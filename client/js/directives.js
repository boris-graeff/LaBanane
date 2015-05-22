/* Directives */

angular.module('LaBanane.directives', [])

    .directive('inputText', function () {

        return function (scope, element) {
            element.on('focus', function(){
                element.addClass('open');
            });

            element.on('blur', function(){
                if(element.val().length === 0){
                    element.removeClass('open');
                }
            });
        };
    });