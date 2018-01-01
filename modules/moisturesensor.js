/**
 * Module for generic moisture Sensors
 **/

function MoistureSensor(/*PIN*/dp){
    this.readPin = dp;
}

MoistureSensor.prototype.getMoistureLevel = function(){
    var moisturePercentage = 0;
    var rawData = analogRead(this.readPin); //spits back 0.0 - 1.0;

    if(!isNaN(rawData)){
        moisturePercentage = Math.round(rawData * 100);

        /*
         * This gives us a number between 0 - 100 where 100 is bone dry
         * I want it be the reverse so 100 is essentially a glass of water
         */
        moisturePercentage = 100 - moisturePercentage;
    }

    return moisturePercentage;
};


//Export module
exports.connect = function (/*PIN*/dp) {
    return new MoistureSensor(dp);
}