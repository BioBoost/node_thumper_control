'use strict';
var Gpio = require('pigpio').Gpio;

create = function(alarmPin) {
    var pin = alarmPin;
    var alarmIsOn = false;

    console.log("Creating PWM alarm");
    var pwm = new Gpio(13, {mode: Gpio.OUTPUT});

    this.on = function(callback, frequency=1000, dutyCycle=125) {
      pwm.pwmFrequency(frequency)
      pwm.pwmWrite(dutyCycle);
      alarmIsOn = true;
      callback(null);
    }

    this.off = function(callback) {
      pwm.pwmWrite(0);
      alarmIsOn = false;
      callback(null);
    }

    this.toggle = function(callback, frequency=1000, dutyCycle=125) {
      if (alarmIsOn) {
        pwm.pwmWrite(0);
      } else {
        pwm.pwmFrequency(frequency)
        pwm.pwmWrite(dutyCycle);
      }
      alarmIsOn = !alarmIsOn;
      callback(null);
    }
}

exports.create = create;
