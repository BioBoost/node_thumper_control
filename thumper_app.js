// Use express module for RESTful API
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

// Set port
app.set('port', process.env.PORT || 3000);

// Configure express to use body-parser as middle-ware.
app.use(bodyParser.json());   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // for parsing application/x-www-form-urlencoded

// If i2c module is not available just ignore i2c
var include_i2c = true;
try {
  var i2c = require('i2c');
} catch(err) {
  include_i2c = false;
  console.log('Module i2c is not installed. Proceeding without ...');
}

if (include_i2c) {
  var address = 0x40;
  var wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface
}

// Log all requests
app.use(function(req, res, next){
  console.log('[' + Date.now() + '] Request received');
  console.log('    url: ' + req.originalUrl);
  console.log('    params: ' + req.params);
  console.log('    body: ' + req.body);
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

  if (include_i2c) {
    wire.readByte(function(err, nos) {
      if (err) {
        console.log('Could not read from i2c: ' + err);
        res.send(JSON.stringify({ number_of_string: "", string_ids: [], status: "failed" }));
      } else {
        var ids = new Array(nos);
        for (i = 0; i < nos; i++) { ids[i] = i; }
        res.send(JSON.stringify({ number_of_string: nos, string_ids: ids, status: "success" }));
      }
    });
  } else {
    res.send(JSON.stringify({ number_of_string: "2", string_ids: [0, 1], status: "success" }));
  }
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
