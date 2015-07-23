/**
 * JQuery slider plugin
 * @author Boris Graeff
 */
(function( $ ) {

    $.fn.slider = function(callback) {

        // Deal with collections
        return this.each(function() {

            var $this = $(this),
                $control = $this.find('.slider-control'),
                $document = $(document);

            // Listen to clik and mousedown events
            $this.on('click', click);
            $control.on('mousedown', drag);

            /**
             * Fired on click
             */
            function click(e){
                e.preventDefault();
                var percent = parseInt((e.pageX - $this.offset().left) / $this.width() * 100);

                console.log("percent");
                console.log(percent);
                console.log($control);

                $control.animate({
                    width : percent+'%'
                }, 500);

                callback(percent);
            }

            /**
             * Start drag listeners
             */
            function drag(e){
                e.preventDefault();
                $document.on('mousemove', moveHandler.bind(this));
                $document.on('mouseup', stopHandler.bind(this));
            }

            /**
             * Fired on drag
             */
            function moveHandler(e){
                var holderOffset = $this.offset().left,
                    sliderWidth = $this.width(),
                    posX = Math.min(Math.max(0, e.pageX - holderOffset), sliderWidth);

                console.log("posX");
                console.log(posX);
                $control.width(posX);
                callback(parseInt(posX / sliderWidth * 100));
            }

            /**
             * Stop drag listeners
             */
            function stopHandler(){
                $document.off('mousemove');
                $document.off('mouseup');
            }
        });
    }
}( jQuery ));