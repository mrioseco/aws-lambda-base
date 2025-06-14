"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var AbstraOutput_1 = __importDefault(require("./AbstraOutput"));
describe('Name of the group', function () {
    var cut;
    beforeEach(function () { });
    test('Name of the group', function () {
        var input = {
            statusCode: 200,
            body: {},
            enableCORS: true,
            bodyXML: '<xml></xml>',
            headersExtra: {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, idImpreso'
            }
        };
        var resp = (0, AbstraOutput_1["default"])(input);
        expect(resp.headers['Access-Control-Allow-Headers']).toContain('idImpreso');
    });
    test('Name of the group', function () {
        var input = {
            statusCode: 200,
            body: {},
            enableCORS: true,
            headersExtra: {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, idImpreso'
            }
        };
        var resp = (0, AbstraOutput_1["default"])(input);
        expect(resp.headers['Access-Control-Allow-Headers']).toContain('idImpreso');
    });
});
