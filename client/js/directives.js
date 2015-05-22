/* Directives */

angular.module('LaBanane.directives', []).
    directive('appVersion', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    })

    .directive('inputText', function () {

        return function (scope, element) {

            element.on('focus', function(){
                console.log(this);
                console.log(arguments);
                element.addClass('open');
            });

            element.on('blur', function(){

                if(element.val().length === 0){
                    element.removeClass('open');
                }

            });

        };
    });