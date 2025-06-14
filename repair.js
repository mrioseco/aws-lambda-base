"use strict";
exports.__esModule = true;
var jsonrepair_1 = require("jsonrepair");
var fs = require('fs');
function repairAndParseJSON() {
    try {
        var json = fs.readFileSync('./jsonMalo.txt', 'utf8');
        var repaired = (0, jsonrepair_1.jsonrepair)(json);
        console.log(repaired);
    }
    catch (err) {
        console.error(err);
    }
}
var jsonObject = repairAndParseJSON();
console.log(jsonObject);
