# Thumper Control RESTful node app

Thumper Control RESTful node app provides a RESTful interface to the thumper controlled by a Raspberry Pi.

## Hardware Requirements

- Raspberry PI connected to TRex motor controller via i2c
- mBed connected to Raspberry Pi via i2c flashed with NeoPixel controller firmware
- NeoPixel strings attached to mBed

## Software requirements
- NeoPixelI2cSlave firmware deployed on the mBed (https://developer.mbed.org/users/dwini/code/NeoPixelI2cSlave/)
- Node installed on Raspberry Pi

## Requirement node app
- express
- body-parser
- i2c

### Version
0.1 (alpha version)

### Installation

TODO

```sh
$ npm install express
$ npm install body-parser
$ npm install git+https://github.com/kelly/node-i2c.git
```

### Running App

Just issue the following command in a terminal

```sh
node thumper_app.js
```

### License
TODO

**Free Software, Hell Yeah!**

