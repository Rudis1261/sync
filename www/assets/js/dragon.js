(function($, window){

    // Reset the env
    var _startX   = 0;
    var _startY   = 0;
    var _endX     = 0;
    var _endY     = 0;
    var _dragging = false;

    var pointerPositionXY = function(e){
      var out = {x:0, y:0};
      if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
      }
      return out;
    };

    // Create the handlers
    $("[data-type='drag-area']").bind({
        mousedown:      function(event) { _activate(event); },
        touchstart:     function(event) { _activate(event); },
        mousemove:      function(event) { _track(event); },
        touchmove:      function(event) { _track(event); },
        mouseup:        function(event) { _complete(event); },
        mouseleave:     function(event) { _complete(event); },
        touchend:       function(event) { _complete(event); },
        touchleave:     function(event) { _complete(event); },
    });

    function _activate(event) {
        event.preventDefault();
        var getXY   = pointerPositionXY(event);
        _dragging   = true;
        _startX     = getXY.x;
        _startY     = getXY.y;
    }

    function _track(event) {
        event.preventDefault();
        if (_dragging) {
            var getXY   = pointerPositionXY(event);
            _endX       = getXY.x;
            _endY       = getXY.y;
        }
    }

    function _complete(event){
        event.preventDefault();
        if (_dragging) {
            var getXY   = pointerPositionXY(event);
            _endX       = getXY.x;
            _endY       = getXY.y;
            alert("X:" + _distance().x + ", Y:" + _distance().y);
            //_logDistance();
            _dragging   = false;
        }
    }

    //setInterval(function(){ _logDistance(); }, 100);
    function _logDistance() {
        var d = _distance();
        $(".results").text("X: " + d.x + ", Y:" + d.y);
    }

    function _distance() {
        var out = { x:0, y:0 };
        if ( _dragging) {
            out.x = _endX - _startX;
            out.y = _endY - _startY;
        }
        return out;
    }

})(jQuery, window);