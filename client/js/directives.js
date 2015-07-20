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
            setTimeout(function(){
                var $el = $(element);
                $el.css('height', $el.parent().outerHeight());

                $el.mCustomScrollbar({
                    theme : 'dark-thin'
                });
            }, 0);
        };
    })

    .directive('playlist', [function () {
        'use strict';

        return function (scope, element) {

            element.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            element.on('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                var data = JSON.parse(event.dataTransfer.getData("track-info"));
                console.log(data);

                if (data.provider === 'playlist') {
                    scope.$apply(scope.moveToPlaylistEnd(data.index));
                }
                else {
                    scope.$apply(scope.addSongToPlaylistEnd(data));
                }

            });
        };
    }])

    .directive('playlistTrack', [function () {
        'use strict';

        return function (scope, element) {

            element.attr('draggable', true);

            element.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();

            });

            element.on('dragend', function (event) {
                event.stopPropagation();
                event.preventDefault();
                element.removeClass("dragged-track");
            });

            element.on('dragstart', function (event) {
                element.addClass("dragged-track");

                var $el = $(element);
                var data = {
                    name: $el.text(),
                    provider : $el.data('provider'),
                    url : $el.data('url'),
                    index : $el.data('index')
                };
                event.dataTransfer.setData("track-info", JSON.stringify(data));
            });

            element.on('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                var data = JSON.parse(event.dataTransfer.getData("track-info"));
                var indexElement = parseFloat(event.target.dataset.index);

                if (data.provider === 'playlist') {
                    scope.$apply(scope.moveSong(data.index, indexElement));
                }
                else{
                    scope.$apply(scope.addSongToPlaylist(indexElement, data));
                }

            });

        };
    }])

    .directive('resourcesTrack', [function () {
        'use strict';

        return function (scope, element) {

            element.attr('draggable', true);

            element.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            element.on('dragstart', function (event) {

                element.addClass("dragged-track");

                var $el = $(element);
                console.log($el);
                var data = {
                    name : $el.text(),
                    provider : $el.data('provider'),
                    url : $el.data('url'),
                    index : $el.data('index')
                };
                event.dataTransfer.setData("track-info", JSON.stringify(data));
            });

            element.on('dragend', function (event) {

                event.stopPropagation();
                event.preventDefault();

                element.removeClass("dragged-track");
            });

            element.on('drop', function () {
                // Do nothing
            });

        };
    }])