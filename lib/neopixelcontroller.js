var i2c = require('i2c');

create = function(i2c_address, i2c_device) {
    var address = i2c_address;
    var wire = new i2c(i2c_address, {device: i2c_device}); // point to your i2c address, debug provides REPL interface

    // Set all leds to same color
    this.setAll = function(red, green, blue, callback) {
      wire.write([0x03, red, green, blue], callback);   // callback = function(err)
    }

    // Strobe all leds with certain delay
    this.strobeAll = function(red, green, blue, delay_ms, callback) {
      wire.write([0x04, red, green, blue, delay_ms], callback);   // callback = function(err)
    }

    this.getNumberOfString = function(callback) {
      wire.readByte(callback);   // callback = function(err, result)
    }
}

exports.create = create;