var slidebtn = (function($, window) {

    function _construct() {
        $(document).on("ready", _init);
    }

    function _init() {
        $(".slide-btn").on("click touchstart", function(event){
          event.preventDefault();
          $(this).toggleClass("on").toggleClass("off");
          var data = $(this).data();
          //console.log(data);
          if ($(this).hasClass("on")){
            eval(data.on);
            $(".mousearea").hide();
            $(".mouse-btn").hide();
          } else {
            eval(data.off);
            $(".mousearea").show();
            $(".mouse-btn").show();
          }
        });
    }
    /**
     * Auto-initialize and construct the module object
     */
    _construct();
    return {};

})(jQuery, window);