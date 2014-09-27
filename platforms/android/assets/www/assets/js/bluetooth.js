var bth = (function($, window, db) {

    //var _keepAlive;
    var _theLoop;
    var _keepAliveInterval = 5000;
    var _loopInterval = 1000;
    var _hide = false;
    var _enabled = false;

    function _construct() {
        $(document).on("deviceready", _init);
        if (_hide) $(".status-on,.status-off").hide();
    }

    function _listen() {
        console.log("START SUBSCRIPTION SERVICE");
        bluetoothSerial.subscribe('\n', function (data) {
            console.log("GETTING DATA");
            console.log(data);
            $(".infoarea").append("<p>" + data + "</p>");
        }, function (data) {
            console.log("GETTING DATA FAILED");
            console.log(data);
            $(".infoarea").append("<p>" + data + "</p>");
        });
    }

    // Check for existing connections
    function _existing_connection() {
        if (db.get("last_connection") !== null) {
            console.log("Existing Pairing Found");
        }
    }

    // External Connect Function
    function _connect(mac_id) {
        db.set("last_connection", mac_id);
        bluetoothSerial.connectInsecure(mac_id,
            _startKeepAlive,
            _killKeepAlive
        );
        _startKeepAlive();
    }

    function _mainLoop(){
        $("div.devices").hide();
            _listen();
        console.log("START KEEP ALIVE");
        _theLoop = setInterval(function(){_loop();}, _loopInterval);
    }

    function _loop() {
        _isEnabled();
    }

    function _isEnabled() {
        bluetoothSerial.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
                $(".status-on").show();
                $(".status-off").hide();
                $('body').removeClass("off");
                $('body').addClass("on");
                _enabled = true;
            },
            function() {
                console.log("Bluetooth is *not* enabled");
                $(".status-on").hide();
                $(".status-off").show();
                $('body').addClass("off");
                $('body').removeClass("on");
                _enabled = false;
            }
        );
    }

    function _startKeepAlive() {
        $("div.devices").hide();
            _listen();
        console.log("START KEEP ALIVE");
        _keepAlive = setInterval(function(){_marco();}, _keepAliveInterval);
    }

    function _killKeepAlive() {
       clearInterval(_keepAlive);
    }

    function _polo() {
        console.log("Received Response!");
    }

    function _marco() {
        console.log("KeepAlive Sent");
        _action("marco");
    }


    // Volume Rocker Event Listener
    function _volumeRocker() {
        $(window).on("volumebuttonslistener", function(event){
            if (event.originalEvent.signal){
                if (event.originalEvent.signal == "volume-down"){
                    _action("vol-down");
                }
                if (event.originalEvent.signal == "volume-up"){
                    _action("vol-up");
                }
            }
        });
    }

    // We have a swipe are we need to be able to detect
    function _swipeArea() {
        var actions         = {};
        var actionText      = {};
        actions["right"]    = "prev";
        actions["left"]     = "next";
        actions["up"]       = "play";
        actions["down"]     = "stop";
        actionText["right"] = "Previous";
        actionText["left"]  = "Next";
        actionText["up"]    = "Playing";
        actionText["down"]  = "Stopped";

        $(".swipearea").swipe({
          swipe:function(event, direction, distance, duration, fingerCount){
            if (actions[direction])  {
              $(this).text(actionText[direction]);
              bth.action(actions[direction]);
            }
          },
          threshold:80
        });
    }

    // The skip left and right buttons also need listeners
    function _touchArea() {
        $(".touchable").on("click touchstart", function(){
          console.log("Tap Detected: " + $(this).data("action"));
          bth.action($(this).data("action"));
        });
    }


    // Manage Manual Actions
    function _action(value) {
        bluetoothSerial.write(value, function (data) {
            console.log(data);
        }, function(data){
             console.log(data);
        });
    }

    // Go Button event listener
    function _goButton() {
        $("input[type='text']").on("keydown", function(event){
            if (event.keyCode == 9 || event.keyCode == 13) {
                _action( $(this).val() );
            }
        });
    }

    // Everything has to start somewhere
    function _init() {

        console.log("Bluetooth INIT");

        // Start other listeners as well
        _volumeRocker();
        _goButton();
        _swipeArea();
        _touchArea();
        //_existing_connection();
        //_alive();
        _isEnabled();
        _mainLoop();

        //$(".message-centre").show();

        /*
        bluetoothSerial.isEnabled(
            function() {
                console.log("Bluetooth is enabled, GREAT SUCCESS");
                bluetoothSerial.isConnected(
                    function() {
                        console.log("Bluetooth is connected");
                    },
                    function() {
                        console.log("Bluetooth is *not* connected");
                        bluetoothSerial.list(function(devices) {
                            devices.forEach(function(device) {
                                console.log(device.id);
                                $("ul.devices").append('<li onClick="bth.connect(\'' + device.id + '\');">' + device.name + ' [' + device.id + ']</li>');
                            });
                        });
                    }
                );
                $(".status-on").show();
                $(".status-off").hide();
            },
            function() {
                console.log("Bluetooth is *not* enabled");
                $(".status-on").hide();
                $(".status-off").show();
            }
        );*/
    }

    /**
     * Auto-initilze and construct the module object
     */
    _construct();
    return {
        // Only the connect function is exposed at the moment
        connect: _connect,
        action: _action
    };

})(jQuery, window, db);