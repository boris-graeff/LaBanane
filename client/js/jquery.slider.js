/**
 * JQuery slider plugin
 * @author Boris Graeff
 */
(function( $ ) {

    $.fn.slider = function() {

        // Deal with collections
        return this.each(function() {
            var $this = $(this),
                $control = $this.find('.control'),
                $document = $(document),
                value = $this.attr('value');

            $control.width(value+'%');

            // Listen to clik and mousedown events
            $this.on('click', change);
            $control.on('mousedown', drag);

            /**
             * Fired on click
             */
            function change(e){
                e.preventDefault();
                var percent = (e.pageX - $this.offset().left) / $this.width() * 100;
                $control.animate({
                    width : percent+'%'
                }, 500);

                update(percent);
            };

            /**
             * Update value attribute
             */
            function update(percent){
                $this.attr('value', Math.round(percent));
            };

            /**
             * Start drag listeners
             */
            function drag(e){
                e.preventDefault();
                $document.on('mousemove', moveHandler.bind(this));
                $document.on('mouseup', stopHandler.bind(this));
            };

            /**
             * Fired on drag
             */
            function moveHandler(e){
                var holderOffset = $this.offset().left,
                    sliderWidth = $this.width(),
                    posX = Math.min(Math.max(0, e.pageX - holderOffset), sliderWidth);

                $control.width(posX);
                update(posX / sliderWidth * 100);
            };

            /**
             * Stop drag listeners
             */
            function stopHandler(){
                $document.off('mousemove');
                $document.off('mouseup');
            };
        });
    }
}( jQuery ));