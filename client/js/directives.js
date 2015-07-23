angular.module('LaBanane.directives', [])


    .directive('progressBar', function () {
        return function(scope, element){
            $(element).slider(scope.seek);
        };
    })

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

    .directive('scrollable', ['$timeout', function ($timeout) {
        return function(scope, element) {
            $timeout(function(){
                var $el = $(element);
                $el.css('height', $el.parent().outerHeight());

                $el.mCustomScrollbar({
                    theme : 'dark-thin'
                });
            }, 0);
        };
    }])

    .directive('playlist', [function () {

        return function (scope, element) {

            element.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            element.on('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                var data = JSON.parse(event.dataTransfer.getData("track-info"));

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

                var index = parseInt($(event.target)[0].dataset.index);
                scope.$apply(scope.remove(index));
            });

            element.on('dragstart', function (event) {
                element.addClass("dragged-track");

                var $el = $(element);
                var data = {
                    name: $el.text(),
                    provider : $el.data('provider'),
                    id : $el.data('id'),
                    index : $el.data('index'),
                    fromPlaylist : true
                };
                event.dataTransfer.setData("track-info", JSON.stringify(data));
            });

            element.on('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                var data = JSON.parse(event.dataTransfer.getData("track-info"));

                var indexElement = parseInt($(event.target).parent()[0].dataset.index);

                if (data.fromPlaylist) {
                    scope.$apply(scope.moveSong(data.index, indexElement));
                }
                else{
                    scope.$apply(scope.addSongToPlaylist(indexElement, data));
                }

            });

        };
    }])

    .directive('resourcesTrack', [function () {

        return function (scope, element) {

            element.attr('draggable', true);

            element.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            element.on('dragstart', function (event) {

                element.addClass("dragged-track");

                var $el = $(element);
                var data = {
                    name : $el.text(),
                    provider : $el.data('provider'),
                    id : $el.data('id'),
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

    .directive('youtubePlayer', ['youtube', function (youtube) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                youtube.bindVideoPlayer(element[0].id);
            }
        };
    }])

    .directive('compile', ['$compile', '$parse', function($compile, $parse) {
        // directive factory creates a link function
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var parsed = $parse(attr.ngBindHtml);

                //Recompile if the template changes
                scope.$watch(
                    function() {
                        return (parsed(scope) || '').toString();
                    },
                    function() {
                        $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
                    }
                );
            }
        };
    }]);