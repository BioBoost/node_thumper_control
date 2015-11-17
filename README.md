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

```sh
$ npm install
```

If working on Raspberry Pi you also need to install the i2c package

```sh
$ npm install git+https://github.com/kelly/node-i2c.git
```

### Running App

Just issue the following command in a terminal

```sh
node thumper_app.js
```

### License
Apache-2.0

**Free Software, Hell Yeah!**

