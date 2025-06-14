"use strict";
exports.__esModule = true;
exports.EventType = void 0;
var jsonrepair_1 = require("jsonrepair");
var EventType;
(function (EventType) {
    EventType["API_GATEWAY"] = "API_GATEWAY";
    EventType["SNS_EVENT"] = "SNS_EVENT";
    EventType["S3_EVENT"] = "S3_EVENT";
    EventType["SQS_EVENT"] = "SQS_EVENT";
    EventType["DEFAULT"] = "DEFAULT";
    EventType["LAMBDA_URL"] = "LAMBDA_URL";
})(EventType = exports.EventType || (exports.EventType = {}));
var makeInput = function (event, context) {
    if (typeof event === 'string') {
        console.log("event es string");
        var objEvent = stringToJSON(event, undefined);
        var output_1 = {
            body: objEvent,
            eventType: EventType.DEFAULT,
            context: context,
            pathParameters: objEvent.pathParameters,
            headers: objEvent.headers
        };
        return output_1;
    }
    if (event.httpMethod !== undefined &&
        event.body !== undefined &&
        event.headers !== undefined) {
        var _a = getBodyFromEvent(event, event.httpMethod), body = _a.body, bodyType = _a.bodyType;
        var output_2 = {
            body: body,
            pathParameters: event.pathParameters,
            queryStringParameters: event.queryStringParameters,
            headers: event.headers,
            eventType: EventType.API_GATEWAY,
            context: context,
            httpMethod: event.httpMethod,
            bodyType: bodyType,
            eventRaw: event,
            resource: event.resource,
            path: event.path
        };
        return output_2;
    }
    if (event.Records && event.Records[0].Sns) {
        var output_3 = {
            body: stringToJSON(event.Records[0].Sns.Message, event.headers),
            eventType: EventType.SNS_EVENT,
            context: context,
            eventRaw: event,
            Message: event.Records[0].Sns.Message
        };
        return output_3;
    }
    if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
        var arrayBody = event.Records.map(function (record) {
            return stringToJSON(record.body, event.headers);
        });
        var output_4 = {
            body: arrayBody,
            eventType: EventType.SQS_EVENT,
            context: context,
            eventRaw: event
        };
        return output_4;
    }
    if (event.Records && event.Records[0].s3) {
        var output_5 = {
            body: event,
            eventType: EventType.S3_EVENT,
            context: context,
            eventRaw: event
        };
        return output_5;
    }
    if (event.version && event.routeKey && event.rawPath) {
        var output_6 = {
            body: JSON.parse(event.body),
            eventType: EventType.LAMBDA_URL,
            context: context,
            pathParameters: event.pathParameters,
            queryStringParameters: event.queryStringParameters,
            headers: event.headers,
            eventRaw: event,
            rawQueryString: event.rawQueryString,
            rawPath: event.rawPath
        };
        return output_6;
    }
    var output = {
        body: event,
        eventType: EventType.DEFAULT,
        context: context,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
        headers: event.headers
    };
    return output;
};
var getBodyFromEvent = function (event, httpMethod) {
    if (event.headers['Content-Type'] === 'application/xml' ||
        event.headers['content-type'] === 'application/xml' ||
        event.headers['Content-Type'] === 'text/xml' ||
        event.headers['content-type'] === 'text/xml') {
        var bodyType_1 = 'xml';
        return { body: event.body, bodyType: bodyType_1 };
    }
    if (httpMethod.toUpperCase() == 'GET') {
        var bodyType_2 = 'json';
        return { body: event.pathParameters, bodyType: bodyType_2 };
    }
    var bodyType = 'json';
    return { body: stringToJSON(event.body, event.headers), bodyType: bodyType };
};
var stringToJSON = function (str, headers) {
    try {
        return JSON.parse(str);
    }
    catch (_a) {
        try {
            var jsonRepairedSring = (0, jsonrepair_1.jsonrepair)(str);
            return JSON.parse(jsonRepairedSring);
        }
        catch (e) {
            console.log("Error parsing string to JSON: ".concat(e));
            console.log("String: ".concat(str));
            console.log("Headers: ".concat(headers));
            return { str: str };
        }
    }
};
exports["default"] = { makeInput: makeInput, stringToJSON: stringToJSON };
