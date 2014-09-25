var bth = (function($, window, db) {
   
    function _construct() {       
        $(document).on("deviceready", _init);         
        if (db.get("last_connection") !== null) {
            console.log("FOUND A HOST!");
        }        
        $(".status-on,.status-off").hide();   
    }

    function _connect(mac_id) {
        // REMEMBER WHICH CONNECTION THE USER CHOSE LAST
        db.set("last_connection", mac_id);
        bluetoothSerial.connectInsecure(
            mac_id, 
            $("div.devices").hide()
        );
    }

    function _message(message) {
        alert(message);
    }

    function _init() {

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

        $("input[type='text']").on("keydown", function(event){
            if (event.keyCode == 9 || event.keyCode == 13) {
                bluetoothSerial.write(
                    $(this).val()
                );
            }
        });

        console.log("Ready to start using bluetooth");
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
        connect: _connect      
    };

})(jQuery, window, db);