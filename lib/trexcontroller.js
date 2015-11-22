var i2c = require('i2c');

create = function(i2c_address, i2c_device) {
    var address = i2c_address;
    var wire = new i2c(i2c_address, {device: i2c_device}); // point to your i2c address, debug provides REPL interface

    var STATUS_PACKET_SIZE = 24;
    var SAFETY_KILL_INTERVAL = 1000;    // ms

    var killSwitch = undefined;

    this.getBatteryVoltage = function(callback) {   // callback = function(err, voltage)
      wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
        if (err) {
          callback(err, 0);
        } else {
          volt = ((buffer[2]*256)+buffer[3])/100.0;
          callback(null, volt);
        }
      });
    }

    this.getErrors = function(callback) {   //calback = function(err, error_flags)
      wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
        if (err) {
          callback(err, null);
        } else {
          var flags = {
            pwm_frequency: (buffer[1] & 0x02) == 0x02,
            motor_speed: (buffer[1] & 0x04) == 0x04,
            low_battery_threshold: (buffer[1] & 0x20) == 0x20
          };
          callback(null, flags);
        }
      });
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
      command[2] = ((left >> 8) & 255);
      command[3] = (left & 255);
      command[5] = ((right >> 8) & 255);
      command[6] = (right & 255);
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
      confirmed = (typeof confirmed === 'undefined') ? true : confirmed;

      if (confirmed) {
        wire.write(command, function(err) {
          if (err) {
            console.log('Send command failed');
            callback(err);
          } else {
            wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
              console.log('Read status from Trex: ' + buffer)
              if (err) {
                console.log('Status read after command send failed');
                callback(err);
              } else {
                // Here we should check the status
                if (buffer[1] == 0x00) {    // No errors
                  callback(null);
                } else {
                  callback('Status indicates error: ' + buffer[1]);
                }
              }
            });
          }
        });    // callback = function(err)
      } else {
        wire.write(command, callback);    // callback = function(err)
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