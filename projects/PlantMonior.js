/**!
 *
 * Espurino Plant Monitoring System
 * ========================
 * Created 2018-01-10 by Huntly Cameron <huntly.cameron@gmail.com>
 *
 * Simple soil moisture and ambient temperature monitoring system.
 *
 *
 *          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 **/

function PlantMonitor() {

    /**
     * Alert configs
     **/
    this.soilMostureAlert = 30; //% moisture
    this.lowTemp = 20; //deg C
    this.highTemp = 35; //deg C

    //Onboard LED's
    this.redLED = LED1;
    this.greenLED = LED2;
    this.blueLED = LED3;

    //Sensors
    this.ow = new OneWire(A1);

    this.moistureSensor = require('moisturesensor').connect(C5);
    this.tempSensor = require("DS18B20").connect(this.ow);

    //General config
    this.intervalVal = 5000;
    this.currentTimeoutID = undefined;

    //Before we begin, make sure all LED's are off
    digitalWrite(this.redLED, 0);
    digitalWrite(this.greenLED, 0);
    digitalWrite(this.blueLED, 0);

    //Start monitoring
    this.monitor();
}

PlantMonitor.prototype.monitor = function(){
    var _self = this;

    var moistureLevel = this.moistureSensor.getMoistureLevel();

    this.tempSensor.getTemp(function (temp) {
        if(temp > _self.lowTemp && temp < _self.highTemp){
            digitalWrite(_self.redLED, 0);
            digitalWrite(_self.greenLED, 1);
        }else{ //outside ideal range, show red led
            digitalWrite(_self.redLED, 1);
            digitalWrite(_self.greenLED, 0);
        }
    });

    if(moistureLevel < this.soilMostureAlert){
        digitalWrite(this.blueLED, 1);
    }else{
        digitalWrite(this.blueLED, 0);
    }


    this.setupNextCheckInterval();
};

PlantMonitor.prototype.getSensorInfo = function(){
    var _self = this;

    var moistureLevel = this.moistureSensor.getMoistureLevel();

    //echo back moisture percentage
    console.log("Soil is "+moistureLevel+"% saturated");

    //Get and echo current ambiant temperature
    this.tempSensor.getTemp(function (temp) {
        console.log("amb tmp is "+temp+"°C");
    });
};

PlantMonitor.prototype.setupNextCheckInterval = function(){
    var _self = this;

    if(this.currentTimeoutID !== undefined){
        clearTimeout(this.currentTimeoutID);
    }

    this.currentTimeoutID = setTimeout(function(){
        _self.monitor();
    },this.intervalVal);
};



var pm = new PlantMonitor();

