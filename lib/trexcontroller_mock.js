create = function(i2c_address, i2c_device) {

    var STATUS_PACKET_SIZE = 9;
    var SAFETY_KILL_INTERVAL = 1000;    // ms

    var killSwitch = undefined;

    this.getBatteryVoltage = function(callback) {   // callback = function(err, voltage)
      callback(null, (6 + (Math.random() * ((12 - 6) + 1))).toFixed(2));
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
          // callback = function(err) in case of confirmed = false
          // callback = function(err, battery_voltage) in case of confirmed = true
      confirmed = (typeof confirmed === 'undefined') ? true : confirmed;

      if (confirmed) {
        callback(null, (6 + (Math.random() * ((12 - 6) + 1))).toFixed(2));
      } else {
        callback(null);
      }
    }

    function killMotors() {
      // Default command and change speeds
      var command = createDefaultCommandPacket();
      console.log('Writing following command package: ' + command);
    };

    function createDefaultCommandPacket() {
      return command = [
          0x0F,                   // Start
          0x00, 0x00, 0x00,       // LEFT
          0x00, 0x00, 0x00,       // RIGHT
          0x30, 0x02              // BATTERY THRESHOLD
      ];
    };
}

exports.create = create;