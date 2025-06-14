"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var AbstraLambdaInteractor_1 = __importStar(require("./AbstraLambdaInteractor"));
var apiGWContentXMLEvent_json_1 = __importDefault(require("./mocks/apiGWContentXMLEvent.json"));
var apiGWContentJsonEvent_json_1 = __importDefault(require("./mocks/apiGWContentJsonEvent.json"));
var apiGWContentJsonEventGET_json_1 = __importDefault(require("./mocks/apiGWContentJsonEventGET.json"));
var eventoSQS = {
    Records: [
        {
            messageId: '',
            receiptHandle: '',
            body: '{"rutfirmante":"16302037-8","vecesDespachadoSII":1,"vecesVerificadoSII":0,"EnviosAECSII":[{"rut":"76789650-6","rutemisordte":"76789650-6","tipo":"33","folio":"48876","idSeq":"1","filename":"aec_re76789650_6_t33_f48876_idsec1.xml","track":"9698656542","idproceso":"0","ts":"2024-06-25 14:24:32.671","tsDespachadoSII":"2024-06-25 14:24:32.671","configDB":"","idserver":"cl-fe-sii-uploadAEC-post","ambiente":"true","server":"aws.lambda","rutCesionario":"99580240-6","rutDeudor":"76970400-0"}]}',
            messageAttributes: {},
            md5OfBody: 'd1ddfd07438f5abb845403a2399d89fe',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:424721259732:cl-sii-verificaEnvioSII',
            awsRegion: 'us-east-1'
        },
        {
            messageId: '',
            receiptHandle: '',
            body: '{"rutfirmante":"16302037-8","vecesDespachadoSII":1,"vecesVerificadoSII":0,"EnviosAECSII":[{"rut":"76789650-6","rutemisordte":"76789650-6","tipo":"33","folio":"48846","idSeq":"1","filename":"aec_re76789650_6_t33_f48846_idsec1.xml","track":"9698656566","idproceso":"0","ts":"2024-06-25 14:24:32.928","tsDespachadoSII":"2024-06-25 14:24:32.928","configDB":"","idserver":"cl-fe-sii-uploadAEC-post","ambiente":"true","server":"aws.lambda","rutCesionario":"99580240-6","rutDeudor":"96924340-7"}]}',
            messageAttributes: {},
            md5OfBody: '',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:424721259732:cl-sii-verificaEnvioSII',
            awsRegion: 'us-east-1'
        },
    ]
};
describe('Abstra Lambda Interactor', function () {
    var cut;
    beforeEach(function () { });
    test.only('Debe reconocer un evento de SQS', function () {
        var input = AbstraLambdaInteractor_1["default"].makeInput(eventoSQS, undefined);
        console.log(typeof input.body);
        console.log(input.body);
        expect(input.eventType).toBe(AbstraLambdaInteractor_1.EventType.SQS_EVENT);
        expect(typeof input.body == 'object').toBe(true);
    });
    test('Debe reconocer un evento de Api Gateway con Body XML', function () {
        var input = AbstraLambdaInteractor_1["default"].makeInput(apiGWContentXMLEvent_json_1["default"], undefined);
        console.log(typeof input.body);
        expect(input.eventType).toBe(AbstraLambdaInteractor_1.EventType.API_GATEWAY);
        expect(typeof input.body == 'string').toBe(true);
        expect(input.bodyType).toBe('xml');
    });
    test('Debe reconocer un evento de Api Gateway con Body Json', function () {
        var input = AbstraLambdaInteractor_1["default"].makeInput(apiGWContentJsonEvent_json_1["default"], undefined);
        expect(input.eventType).toBe(AbstraLambdaInteractor_1.EventType.API_GATEWAY);
        expect(input.body).toBeInstanceOf(Object);
        expect(input.bodyType).toBe('json');
        expect(input.httpMethod).toBe('POST');
    });
    test('Debe reconocer un evento de Api Gateway con Body Json', function () {
        var input = AbstraLambdaInteractor_1["default"].makeInput(apiGWContentJsonEventGET_json_1["default"], undefined);
        expect(input.eventType).toBe(AbstraLambdaInteractor_1.EventType.API_GATEWAY);
        expect(input.body).toBeInstanceOf(Object);
        expect(input.bodyType).toBe('json');
        expect(input.httpMethod).toBe('GET');
        expect(JSON.stringify(input.pathParameters)).toBe(JSON.stringify(input.body));
    });
});
