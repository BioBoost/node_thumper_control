var i2c = require('i2c');

create = function(i2c_address, i2c_device) {
    var address = i2c_address;
    var wire = new i2c(i2c_address, {device: i2c_device}); // point to your i2c address, debug provides REPL interface

    var STATUS_PACKET_SIZE = 9;
    var SAFETY_KILL_INTERVAL = 1000;    // ms

    var killSwitch = undefined;

    this.getBatteryVoltage = function(callback) {   // callback = function(err, voltage)
      wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
        if (err) {
          callback(err, 0);
        } else {
          volt = ((buffer[3]*256)+buffer[2])/100.0;
          callback(null, volt);
        }
      });
    }

    this.getErrors = function(callback) {   // callback = function(err, error_flags)
      wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
        if (err) {
          callback(err, null);
        } else {
          var flags = {
            motor_speed: (buffer[1] & 0x04) == 0x04,
            low_battery_threshold: (buffer[1] & 0x08) == 0x08
          };
          callback(null, flags);
        }
      });
    }

    // Needs refactor. Not sure how yet. Damn u JavaScript
    this.setSpeed = function(left, right, callback) {   // callback = function(err, battery_voltage)
      // If we got a killSwitch scheduled, clear it
      if (killSwitch != undefined) {
        clearTimeout(killSwitch);
        console.log("Cleared timeout");
      };

      // Default command and change speeds
      var command = createDefaultCommandPacket();
      command[1] = (left & 255);
      command[2] = ((left >> 8) & 255);
      command[4] = (right & 255);
      command[5] = ((right >> 8) & 255);
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
        wire.write(command, function(err) {
          if (err) {
            console.log('Send command failed');
            callback(err, null);
          } else {
            wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
              console.log('Read status from Trex: ' + buffer)
              if (err) {
                console.log('Status read after command send failed');
                callback(err, null);
              } else {
                // Get the battery voltage
                volt = ((buffer[3]*256)+buffer[2])/100.0;

                // Here we should check the status
                if (buffer[1] == 0x00) {    // No errors
                  callback(null, volt);
                } else {
                  callback('Status indicates error: ' + buffer[1], volt);
                }
              }
            });
          }
        });
      } else {
        wire.write(command, callback);
      }
    }

    function killMotors() {
      // Default command and change speeds
      var command = createDefaultCommandPacket();
      console.log('Writing following command package: ' + command);

      sendCommand(command, function(err){
        if (err) {
          sendCommand(command, function(err){
            if (err) {
              // Here we should have a way to EXTERNALLY KILL the THUMPER
              console.log("Thumper is running free. Get the shotguns boys!!");
            }
          }, false);
        }
      }, false);
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