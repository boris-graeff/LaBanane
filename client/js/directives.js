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
                console.log('drop playlist');
                event.stopPropagation();
                event.preventDefault();

                var data = JSON.parse(event.dataTransfer.getData("track-info"));

                if (data.fromPlaylist) {
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
    }])

    .directive('progressBar', function () {
        return {
            restrict: 'E',
            scope: {
                callback: '='
            },
            replace: true,
            template: "<div class='slider'><div class='slider-control'><div class='slider-cursor'></div></div></div>",

            link: function link($scope, $elem, attrs) {

                var $el = $($elem[0]),
                    $control = $el.find('.slider-control'),
                    $document = $(document),
                    value = 0;
                $scope.dragged = false;

                $el.on('click', function(e){
                    e.preventDefault();
                    value = Math.round((e.pageX - $el.offset().left) / $el.width() * 100);
                    update(value);
                    $scope.callback(value);
                });

                $control.on('mousedown', function(e){
                    $scope.dragged = true;
                    $control.addClass('dragged');
                    e.preventDefault();
                    $document.on('mousemove', moveHandler.bind(this));
                    $document.on('mouseup', stopHandler.bind(this));
                });

                $scope.$watch(function() {
                    return attrs.value;
                }, function(value){
                    update(value);
                });

                function update(value) {
                    if(!$scope.dragged){
                        $control[0].style.width = value + '%';
                    }
                }

                function moveHandler(e){
                    var holderOffset = $el.offset().left,
                        sliderWidth = $el.width(),
                        posX = Math.min(Math.max(0, e.pageX - holderOffset), sliderWidth);
                    value = Math.round(posX / sliderWidth * 100);
                    $control[0].style.width = value+ '%';
                }

                function stopHandler(){
                    $scope.dragged = false;
                    $control.removeClass('dragged');
                    $document.off('mousemove');
                    $document.off('mouseup');
                    $scope.callback(value);
                }
            }
        };
    });