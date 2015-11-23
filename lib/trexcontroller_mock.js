create = function(i2c_address, i2c_device) {

    var STATUS_PACKET_SIZE = 24;
    var SAFETY_KILL_INTERVAL = 1000;    // ms

    var killSwitch = undefined;

    this.getBatteryVoltage = function(callback) {   // callback = function(err, voltage)
      callback(null, 6 + (int)(Math.random() * ((12 - 6) + 1)));
    }

    this.getErrors = function(callback) {   //calback = function(err, error_flags)
      callback(err, [0, 0, 0]);
    }

    // Needs refactor. Not sure how yet. Damn u JavaScript
    this.setSpeed = function(left, right, callback) {
      // If we got a killSwitch scheduled, clear it
      if (killSwitch != undefined) {
        clearTimeout(killSwitch);
        console.log("Cleared timeout");
      };

      // Default command and change speeds
      var command = createDefaultCommandPacket();
      console.log('Writing following command package: ' + command);

      sendCommand(command, callback);

      // Schedule new kill switch
      console.log("Creating timeout");
      killSwitch = setTimeout(function(){
        console.log("Calling kill function");
        killMotors();
      }, SAFETY_KILL_INTERVAL);
    }

    // Confirmed == true will read status after write
    function sendCommand(command, callback, confirmed) {
      callback(null);
    }

    function killMotors() {
      // Default command and change speeds
      var command = createDefaultCommandPacket();
      console.log('Writing following command package: ' + command);
    };

    function createDefaultCommandPacket() {
      return command = [
          0x0F,
          0x06,
          0x00, 0x00, 0x00,       // LEFT
          0x00, 0x00, 0x00,       // RIGHT
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00,    // servos
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00,    // servos
          0x32,                   // Devibrate
          0x00, 0x00,             // Impact
          0x02, 0x30,             // low batt
          0x07,                   // i2c address
          0x00                    // clock
      ];
    };
}

exports.create = create;