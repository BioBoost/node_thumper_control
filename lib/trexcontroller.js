var i2c = require('i2c');

create = function(i2c_address, i2c_device) {
    var address = i2c_address;
    var wire = new i2c(i2c_address, {device: i2c_device}); // point to your i2c address, debug provides REPL interface

    var STATUS_PACKET_SIZE = 24

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

    // Needs refactor. Not sure how yet. Damn u JavaScript
    this.setSpeed = function(left, right, callback) {
      left_speed = left;
      right_speed = right;

      var command = [
          0x0F,
          0x06,
          0x00,       // LEFT
          0x00,
          0x00,
          0x00,       // RIGHT
          0x00,
          0x00,
          0x00,       // servos
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x32,           // Devibrate
          0x00,           // Impact
          0x00,       
          0x02,           // low batt
          0x30,           // low batt
          0x07,           // i2c address
          0x00            // clock
      ];

      command[2] = ((left_speed >> 8) & 255);
      command[3] = (left_speed & 255);
      
      command[5] = ((right_speed >> 8) & 255);
      command[6] = (right_speed & 255);

      console.log('Writing following command package: ' + command);

      wire.read(STATUS_PACKET_SIZE, function(err, buffer) {
        if (err) {
          console.log('Could not read status after speed write');
        } else {
          console.log('Status = ' + buffer);
        }
      });

      wire.write(command, callback);    // callback = function(err)
    }
}

exports.create = create;