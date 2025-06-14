"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.handler = void 0;
var AbstraLambdaHandler_1 = __importDefault(require("./adapters/AbstraLambdaHandler"));
var main_1 = __importDefault(require("./main"));
exports.handler = (0, AbstraLambdaHandler_1["default"])(main_1["default"]);
