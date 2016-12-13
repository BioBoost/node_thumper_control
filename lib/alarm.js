var gpio = require('rpi-gpio');

create = function(alarmPin) {
    var pin = alarmPin;
    var alarmIsOn = false;

    gpio.setup(pin, gpio.DIR_OUT, function(err) {
      if (err) {
        console.log("Failed to open gpio " + pin + " for alarm");
      } else {
        // How can we call off() function here ?
        gpio.write(pin, false, function(err) {
          if (err) {
            console.log("Failed to de-activate alarm");
          } else {
            console.log("Alarm is off");
          }
        });
      }
    });

    this.on = function(callback) {
      gpio.write(pin, true, function(err) {
        if (err) {
          console.log("Failed to activate alarm");
        } else {
          console.log("Alarm is on");
          alarmIsOn = true;
        }
        callback(err);
      });
    }

    this.off = function(callback) {
      gpio.write(pin, false, function(err) {
        if (err) {
          console.log("Failed to de-activate alarm");
        } else {
          console.log("Alarm is off");
          alarmIsOn = false;
        }
        callback(err);
      });
    }

    this.toggle = function(callback) {
      gpio.write(pin, !alarmIsOn, function(err) {
        if (err) {
          console.log("Failed to toggle alarm");
        } else {
          console.log("Toggled alarm");
          alarmIsOn = !alarmIsOn;
        }
        callback(err);
      });
    }
}

exports.create = create;
