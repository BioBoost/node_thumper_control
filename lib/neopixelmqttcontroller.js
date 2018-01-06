var mqtt = require('mqtt')

create = function(mqtt_broker) {
    var client  = mqtt.connect('tcp://' + mqtt_broker)

    client.on('connect', function () {
      console.log("Connected to mqtt broker");
    })

    // Set all leds to same color
    this.setAll = function(red, green, blue, callback) {
      var data = {
        "state": "ON",
        "brightness": 25,
        "color": {"r": red, "g": green, "b": blue}
      };
      client.publish("thumper/neopixels/set", JSON.stringify(data))
      callback(null);
    }

    // Strobe all leds with certain delay
    this.strobeAll = function(red, green, blue, delay_ms, callback) {
      var data = {
        "state": "ON",
        "brightness": 25,
        "color": {"r": red, "g": green, "b": blue},
        "effect": "strobe",
        "interval_ms": delay_ms
      };
      client.publish("thumper/neopixels/set", JSON.stringify(data))
      callback(null);
    }

    // Shift all leds with certain delay and group size
    this.shiftAll = function(red, green, blue, delay_ms, groupsize, callback) {
      var data = {
        "state": "ON",
        "brightness": 25,
        "color": {"r": red, "g": green, "b": blue},
        "effect": "groupshift",
        "interval_ms": delay_ms,
        "group_size": groupsize
      };
      client.publish("thumper/neopixels/set", JSON.stringify(data))
      callback(null);
    }

    this.getNumberOfString = function(callback) {
      callback(null, 8);
    }
}

exports.create = create;
