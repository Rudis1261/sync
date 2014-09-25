var bth = (function($, window, db) {
   
    function _construct() {       
        $(document).on("deviceready", _init); 
        $(".status-on,.status-off").hide();   
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
        bluetoothSerial.connectInsecure(
            mac_id, 
            $("div.devices").hide()
        );
    }

    // Volume Rocker Event Listener
    function _volumeRocker() {
        $(window).on("volumebuttonslistener", function(event){
            if (event.originalEvent.signal){
                if (event.originalEvent.signal == "volume-down"){
                    bluetoothSerial.write("vol-down");
                }
                if (event.originalEvent.signal == "volume-up"){
                    bluetoothSerial.write("vol-up");
                }
            }
        });
    }

    // Go Button event listener
    function _goButton() {
        $("input[type='text']").on("keydown", function(event){
            if (event.keyCode == 9 || event.keyCode == 13) {
                bluetoothSerial.write(
                    $(this).val()
                );
            }
        });
    }

    // Everything has to start somewhere
    function _init() {

        console.log("Bluetooth INIT");

        // Start other listeners as well
        _volumeRocker();
        _goButton();
        _existing_connection();

        bluetoothSerial.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
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
                            })
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
        );
    }

    /**
     * Auto-initilze and construct the module object
     */
    _construct();
    return {
        // Only the connect function is exposed at the moment
        connect: _connect      
    };

})(jQuery, window, db);