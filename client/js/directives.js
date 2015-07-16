/* Directives */

angular.module('LaBanane.directives', [])

    .directive('inputText', function () {

        return function (scope, element) {
            element.on('focus', function(){
                element.parent().addClass('open');
            });

            element.on('blur', function(){
                if(element.val().length === 0){
                    element.parent().removeClass('open');
                }
            });
        };
    })

    .directive('scrollable', function () {
        return function(scope, element) {
            var $el = $(element[0]);
            console.log($el.parent().height());
            console.log($el.parent().innerHeight());
            console.log($el.parent().outerHeight());
            $el.css('height', $el.parent().outerHeight());

            $el.mCustomScrollbar({
                theme : 'dark-thin'
            });
        };
    });

