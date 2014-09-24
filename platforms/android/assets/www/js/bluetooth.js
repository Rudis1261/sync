var btn = (function($, window) {

    function _construct() {       
        $(document).on("deviceready", _init);          
        $(".status-on,.status-off").hide();   
    }

    function _connect(mac_id) {
        bluetoothSerial.connectInsecure(
            mac_id, 
            $(".devices").hide()
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
                                $(".devices").append('<li onClick="btn.connect(\'' + device.id + '\');">' + device.name + ' [' + device.id + ']</li>');
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

})(jQuery, window);