// Use express module for RESTful API
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

// If library is detected we use real controllers
try {
  require('i2c');
  var NeoPixelController = require('./lib/neopixelcontroller');
  var TRexController = require('./lib/trexcontroller');
  console.log("Running in production mode");
} catch(err) {   // else we use mocked controllers
  var NeoPixelController = require('./lib/neopixelcontroller_mock');
  var TRexController = require('./lib/trexcontroller_mock');
  console.log("Running in development mode with mocked controllers");
}

// Set port
app.set('port', process.env.PORT || 3000);

// Configure express to use body-parser as middle-ware.
app.use(bodyParser.json());   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // for parsing application/x-www-form-urlencoded

var neopix = new NeoPixelController.create(0x40, '/dev/i2c-1');
var trex = new TRexController.create(0x07, '/dev/i2c-1');

// Log all requests
app.use(function(req, res, next){
  console.log('[' + Date.now() + '] Request received');
  console.log('    url: ' + req.originalUrl);
  console.log('    params: ' + JSON.stringify(req.params));
  console.log('    body: ' + JSON.stringify(req.body));
  next();
});

// @GET
// returns { "message": "Hello and welcome to the Thumper Control RESTful API" }
app.get('/', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: "Hello and welcome to the Thumper Control RESTful API" }));
});

// @GET
// returns { "battery_voltage": 7.88, status: "success" }
app.get('/batteryvoltage', function (req, res){
  res.setHeader('Content-Type', 'application/json');

  trex.getBatteryVoltage(function(err, voltage) {
    if (err) {
      console.log('Could not read status from trex controller: ' + err);
      res.send(JSON.stringify({ battery_voltage: null, status: "failed" }));
    } else {
      res.send(JSON.stringify({ battery_voltage: voltage, status: "success" }));
    }
  });
});

// @GET
// returns { "pwm_frequency": false, "motor_speed": false, "low_battery_threshold": false, status: "success" }
app.get('/errors', function (req, res){
  res.setHeader('Content-Type', 'application/json');

  trex.getErrors(function(err, error_flags) {
    if (err) {
      console.log('Could not read status from trex controller: ' + err);
      res.send(JSON.stringify({
        pwm_frequency: null,
        motor_speed: null,
        low_battery_threshold: null,
        status: "failed" }));
    } else {
      res.send(JSON.stringify({
        pwm_frequency: error_flags.pwm_frequency,
        motor_speed: error_flags.motor_speed,
        low_battery_threshold: error_flags.low_battery_threshold,
        status: "success" }));
    }
  });
});

// @GET
// returns { "number_of_string": 2, "string_ids": [0,1], "status":"success" }
app.get('/neopixels/strings', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  neopix.getNumberOfString(function(err, nos) {
    if (err) {
      console.log('Could not read from i2c: ' + err);
      res.send(JSON.stringify({ number_of_string: null, string_ids: null, status: "failed" }));
    } else {
      var ids = new Array(nos);
      for (i = 0; i < nos; i++) { ids[i] = i; }
      res.send(JSON.stringify({ number_of_string: nos, string_ids: ids, status: "success" }));
    }
  });
});

// @GET
// returns { "string_id": "1", "number_of_pixels": 8 }
app.get('/neopixels/strings/:id', function (req, res) {
  var id = req.params.id    // id is currently unused (i2c function not implemented yet)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ string_id: id, number_of_pixels: 8 }));
});

// @POST
// expects { "red": 10, "green": 255, "blue": 0 }
// returns { "status": "success" }
app.post('/neopixels/strings/:id', function (req, res) {
  var id = req.params.id    // id is currently unused (i2c function not implemented yet)
  var red = req.body.red;
  var green = req.body.green;
  var blue = req.body.blue;
  console.log('Setting color for string ' + id + ' to R=' + red + ' G=' + green + ' B=' + blue);

  res.setHeader('Content-Type', 'application/json');

  neopix.setAll(red, green, blue, function(err){
    if (err) {
      console.log('Could not write color to i2c: ' + err);
      res.send(JSON.stringify({ status: "failed" }));
    } else {
      res.send(JSON.stringify({ status: "success" }));
    }
  });
});

// @POST
// expects { "red": 10, "green": 255, "blue": 0, "delay": 100 }
// returns { "status": "success" }
app.post('/neopixels/effects/strobe/:id', function (req, res) {
  var id = req.params.id    // id is currently unused (i2c function not implemented yet)
  var red = req.body.red;
  var green = req.body.green;
  var blue = req.body.blue;
  var delay = req.body.delay;
  console.log('Strobing for string ' + id + ' to R=' + red + ' G=' + green + ' B=' + blue + 'with delay=' + delay + 'ms');

  res.setHeader('Content-Type', 'application/json');

  neopix.strobeAll(red, green, blue, delay
    , function(err){
    if (err) {
      console.log('Could not write strobe to i2c: ' + err);
      res.send(JSON.stringify({ status: "failed" }));
    } else {
      res.send(JSON.stringify({ status: "success" }));
    }
  });
});

// @POST
// expects { "red": 10, "green": 255, "blue": 0, "delay": 100, "groupsize": 8 }
// returns { "status": "success" }
app.post('/neopixels/effects/shift/:id', function (req, res) {
  var id = req.params.id    // id is currently unused (i2c function not implemented yet)
  var red = req.body.red;
  var green = req.body.green;
  var blue = req.body.blue;
  var delay = req.body.delay;
  var groupsize = req.body.groupsize;
  console.log('Shifting for string ' + id + ' to R=' + red + ' G=' + green + ' B=' + blue
              + 'with delay=' + delay + 'ms and groupsize of ' + groupsize);

  res.setHeader('Content-Type', 'application/json');

  neopix.shiftAll(red, green, blue, delay, groupsize, function(err){
    if (err) {
      console.log('Could not write shift to i2c: ' + err);
      res.send(JSON.stringify({ status: "failed" }));
    } else {
      res.send(JSON.stringify({ status: "success" }));
    }
  });
});

// @POST
// expects { "left_speed": 10, "right_speed": 255 }
// returns { "status": "success" }
app.post('/speed', function (req, res) {
  var left_speed = req.body.left_speed;
  var right_speed = req.body.right_speed;
  console.log('Setting thumper speed ' + ' to L=' + left_speed + ' R=' + right_speed);

  res.setHeader('Content-Type', 'application/json');

  trex.setSpeed(left_speed, right_speed, function(err){
    if (err) {
      console.log('Could not set Trex speed: ' + err);
      res.send(JSON.stringify({ status: "failed" }));
    } else {
      res.send(JSON.stringify({ status: "success" }));
    }
  });
});

// Custom 404 (needs to be last in line of routes)
app.use(function(req, res, next){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

// Custom 500
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Internal server error');
});

// Server process
app.listen(app.get('port'), function(){
  console.log('Express app started on http://localhost:' + app.get('port'));
  console.log('Press CTRL-c to kill');
});
