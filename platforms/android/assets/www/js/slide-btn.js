var slidebtn = (function($, window) {

    function _construct() {       
        $(document).on("ready", _init);         
    }

    function _init() {
        $(".slide-btn").click(function(event){         
          event.preventDefault();
          $(this).toggleClass("on").toggleClass("off");
        });
    }
    /**
     * Auto-initialize and construct the module object
     */
    _construct();
    return { };

})(jQuery, window);