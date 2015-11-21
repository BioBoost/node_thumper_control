// Use express module for RESTful API
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var NeoPixelController = require('./lib/neopixelcontroller');

// Set port
app.set('port', process.env.PORT || 3000);

// Configure express to use body-parser as middle-ware.
app.use(bodyParser.json());   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // for parsing application/x-www-form-urlencoded

var neopix = new NeoPixelController.create(0x40, '/dev/i2c-1');

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
// returns { "battery_voltage": "7.88" }
app.get('/batteryvoltage', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  var voltage = (7 + (Math.random() * ((11 - 7) + 1))).toFixed(2);;
  res.send(JSON.stringify({ batteryvoltage: voltage }));
});

// @GET
// returns { "number_of_string": "2", "string_ids": [0,1], "status":"success" }
app.get('/neopixels/strings', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  neopix.getNumberOfString(function(err, nos) {
    if (err) {
      console.log('Could not read from i2c: ' + err);
      res.send(JSON.stringify({ number_of_string: "", string_ids: [], status: "failed" }));
    } else {
      var ids = new Array(nos);
      for (i = 0; i < nos; i++) { ids[i] = i; }
      res.send(JSON.stringify({ number_of_string: nos, string_ids: ids, status: "success" }));
    }
  });
});

// @GET
// returns { "string_id": "1", "number_of_pixels": "8" }
app.get('/neopixels/strings/:id', function (req, res) {
  var id = req.params.id    // id is currently unused (i2c function not implemented yet)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ string_id: id, number_of_pixels: "8" }));
});

// @POST
// expects { red": 10, "green": 255, "blue": 0 }
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
