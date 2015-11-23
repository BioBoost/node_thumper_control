create = function(i2c_address, i2c_device) {

    // Set all leds to same color
    this.setAll = function(red, green, blue, callback) {
      callback(null);
    }

    // Strobe all leds with certain delay
    this.strobeAll = function(red, green, blue, delay_ms, callback) {
      callback(null);
    }

    this.getNumberOfString = function(callback) {
      callback(null, 8);
    }
}

exports.create = create;