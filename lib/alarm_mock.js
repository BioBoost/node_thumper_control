create = function(alarmPin) {
    var pin = alarmPin;
    var alarmIsOn = false;

    this.on = function(callback) {
      console.log("Alarm is on");
      alarmIsOn = true;
      callback(null);
    }

    this.off = function(callback) {
      console.log("Alarm is off");
      alarmIsOn = false;
      callback(null);
    }

    this.toggle = function(callback) {
      console.log("Toggled alarm");
      alarmIsOn = !alarmIsOn;
      callback(null);
    }
}

exports.create = create;
