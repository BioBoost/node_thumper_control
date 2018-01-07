# Thumper Control RESTful node app

Thumper Control RESTful node app provides a RESTful interface to the thumper controlled by a Raspberry Pi.

## Important
This application is meant to be used with the new TRex firmware which can be found at https://github.com/BioBoost/thumper_trex_firmware

## Exposed API
The status key included in some responses indicates the state of the performed action on the Thumper. Success indicates a successful data transfer via i2c and failed indicates that the i2c data transfer was not successful. In case of a failed transaction the response data cannot be considered valid and will most of the time contain null-values.

### Saying hello to the thumper
```javascript
    // @GET /
    returns { "message": "Hello and welcome to the Thumper Control RESTful API" }
```

### Request the current voltage level of the battery
```javascript
    //  @GET /batteryvoltage
    returns { "battery_voltage": 7.88, status: "success" }
```

### Request the error flags
```javascript
    //  @GET /errors
    returns { "motor_speed": false, "low_battery_threshold": false, status: "success" }
```

### Request number of attached neopixel strings and their ids

This is not fully implemented yet. You should assume that a single string is attached to the Thumper and it has the ID of 0. It contains 16 pixels (not relevant for the moment).

```javascript
    //  @GET /neopixels/strings
    returns { "number_of_string": 2, "string_ids": [0,1], "status":"success" }
```

### Set the color of all the neopixel LEDs of a specified string. On the mBed side this is called a ColorEffect.

The red, green and blue values should be in the range of [0, 255].

```javascript
    //  @POST /neopixels/strings/:id
    expects { "red": 10, "green": 255, "blue": 0 }
    returns { "status": "success" }
```

### Set the color of all the neopixel LEDs of a specified string and initiate a strobe effect. On the mBed side this is called a StrobeEffect.

The red, green and blue values should be in the range of [0, 255]. The delay should be between [10, 255] (milliseconds).

```javascript
    //  @POST /neopixels/effects/strobe/:id
    expects { "red": 10, "green": 255, "blue": 0, "delay": 100 }
    returns { "status": "success" }
```

### Let a single LED shift through a group of LEDs. Size of group can be divident of actual string size. On the mBed side this is called a ShiftEffect.

The red, green and blue values should be in the range of [0, 255]. The delay should be between [10, 255] (milliseconds).

```javascript
    //  @POST /neopixels/effects/shift/:id
    expects { "red": 10, "green": 255, "blue": 0, "delay": 100, "groupsize": 8 }
    returns { "status": "success" }
```

### Set the left and right side speed of the Thumper. Values can be negative to drive backwards.

While the refresh time of drive commands can vary on the server side it should never be expected to be less than 500ms. Do make sure not to overflow the server side by taking extreme low refresh times.

```javascript
    //  @POST /speed
    expects { "left_speed": 10, "right_speed": 255 }
    returns { "battery_voltage": 7.88, "status": "success" }
```

### Request the number of pixels for a specified string (identified using its string id)

This is not fully implemented yet. You should assume that a single string is attached to the Thumper and it has the ID of 0. It contains 16 pixels (not relevant for the moment).

```javascript
    //  @GET /neopixels/strings/:id
    returns { "string_id": "1", "number_of_pixels": 8 }
```

### Set, reset or toggle the alarm of the Thumper

The state of the alarm can be manipulated by using the action attribute. It can be set to `on`, `off` or `toggle`.

```javascript
    //  @POST /alarm
    expects { "action": "on|off|toggle" }
    returns { "status": "success" }
```

## Hardware Requirements

- Raspberry PI connected to TRex motor controller via i2c
- mBed connected to Raspberry Pi via i2c flashed with NeoPixel controller firmware
- NeoPixel strings attached to mBed
- Piezo attached to GPIO22 (pin 15, 8th pin on the left side)

## Software requirements
- NeoPixelI2cSlave firmware deployed on the mBed (https://developer.mbed.org/users/dwini/code/NeoPixelI2cSlave/)
- Node installed on Raspberry Pi

## Requirement node app
- express
- body-parser
- i2c
- rpi-gpio

### Version
0.3 (alpha version)

### Installation

```sh
sudo su
npm install --unsafe-perm
```

If working on Raspberry Pi you also need to install the i2c package

```sh
sudo su
npm install --unsafe-perm i2c
```

`--unsafe-perm` is required to be able to install npm packages as root.

#### Requirements on Windows with mocked Hardware

* Make sure you have python installed (version 2.7 or similar). Also make sure it is added to path (installer checkbox in list)
* Install node.js on your computer
* Install windows building tools via powershell (run as administrator): `npm install --global --production windows-build-tools`

### Running App

Just issue the following command in a terminal

```sh
node thumper_app.js
```

Or as root if you want the alarm to work (need workaround for root for GPIO)

```sh
sudo node thumper_app.js
```

## Run as a Service

```shell
chmod +x thumper_app.py
sudo su
cp thumper_control.service /etc/systemd/system
systemctl enable thumper_control.service
systemctl start thumper_control.service
```

### License
Apache-2.0

**Free Software, Hell Yeah!**
