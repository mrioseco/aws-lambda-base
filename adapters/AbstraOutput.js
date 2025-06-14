"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports["default"] = (function (input) {
    var statusCode = input.statusCode, body = input.body, enableCORS = input.enableCORS, bodyXML = input.bodyXML;
    var headersExtraOK = input.headersExtra || {};
    var cors = enableCORS
        ? {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
        : {};
    if (bodyXML) {
        var resp_1 = {
            statusCode: statusCode,
            headers: __assign(__assign({ 'Content-Type': 'text/xml; charset=utf-8' }, cors), headersExtraOK),
            body: bodyXML
        };
        return resp_1;
    }
    var resp = {
        statusCode: statusCode,
        headers: __assign(__assign({ 'Content-Type': 'application/json' }, cors), headersExtraOK),
        body: JSON.stringify(body)
    };
    return resp;
});
