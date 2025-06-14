import AbstraLambdaInteractor, { EventType } from './AbstraLambdaInteractor'
import apiGWContentXMLEvent from './mocks/apiGWContentXMLEvent.json'
import apiGWContentJsonEvent from './mocks/apiGWContentJsonEvent.json'
import apiGWContentJsonEventGET from './mocks/apiGWContentJsonEventGET.json'

const eventoSQS = {
    Records: [
        {
            messageId: '',
            receiptHandle: '',
            body: '{"rutfirmante":"16302037-8","vecesDespachadoSII":1,"vecesVerificadoSII":0,"EnviosAECSII":[{"rut":"76789650-6","rutemisordte":"76789650-6","tipo":"33","folio":"48876","idSeq":"1","filename":"aec_re76789650_6_t33_f48876_idsec1.xml","track":"9698656542","idproceso":"0","ts":"2024-06-25 14:24:32.671","tsDespachadoSII":"2024-06-25 14:24:32.671","configDB":"","idserver":"cl-fe-sii-uploadAEC-post","ambiente":"true","server":"aws.lambda","rutCesionario":"99580240-6","rutDeudor":"76970400-0"}]}',
            messageAttributes: {},
            md5OfBody: 'd1ddfd07438f5abb845403a2399d89fe',
            eventSource: 'aws:sqs',
            eventSourceARN:
                'arn:aws:sqs:us-east-1:424721259732:cl-sii-verificaEnvioSII',
            awsRegion: 'us-east-1',
        },
        {
            messageId: '',
            receiptHandle: '',
            body: '{"rutfirmante":"16302037-8","vecesDespachadoSII":1,"vecesVerificadoSII":0,"EnviosAECSII":[{"rut":"76789650-6","rutemisordte":"76789650-6","tipo":"33","folio":"48846","idSeq":"1","filename":"aec_re76789650_6_t33_f48846_idsec1.xml","track":"9698656566","idproceso":"0","ts":"2024-06-25 14:24:32.928","tsDespachadoSII":"2024-06-25 14:24:32.928","configDB":"","idserver":"cl-fe-sii-uploadAEC-post","ambiente":"true","server":"aws.lambda","rutCesionario":"99580240-6","rutDeudor":"96924340-7"}]}',
            messageAttributes: {},
            md5OfBody: '',
            eventSource: 'aws:sqs',
            eventSourceARN:
                'arn:aws:sqs:us-east-1:424721259732:cl-sii-verificaEnvioSII',
            awsRegion: 'us-east-1',
        },
    ],
}

describe('Abstra Lambda Interactor', () => {
    let cut

    beforeEach(() => {})

    test.only('Debe reconocer un evento de SQS', () => {
        //console.log(apiGWContentXMLEvent)

        const input = AbstraLambdaInteractor.makeInput(eventoSQS, undefined)

        console.log(typeof input.body)

        console.log(input.body)

        expect(input.eventType).toBe(EventType.SQS_EVENT)
        expect(typeof input.body == 'object').toBe(true)
        //expect(input.bodyType).toBe('xml')
    })

    test('Debe reconocer un evento de Api Gateway con Body XML', () => {
        //console.log(apiGWContentXMLEvent)

        const input = AbstraLambdaInteractor.makeInput(
            apiGWContentXMLEvent,
            undefined
        )

        console.log(typeof input.body)

        expect(input.eventType).toBe(EventType.API_GATEWAY)
        expect(typeof input.body == 'string').toBe(true)
        expect(input.bodyType).toBe('xml')
    })

    test('Debe reconocer un evento de Api Gateway con Body Json', () => {
        //console.log(apiGWContentJsonEvent)

        const input = AbstraLambdaInteractor.makeInput(
            apiGWContentJsonEvent,
            undefined
        )

        expect(input.eventType).toBe(EventType.API_GATEWAY)
        expect(input.body).toBeInstanceOf(Object)
        expect(input.bodyType).toBe('json')
        expect(input.httpMethod).toBe('POST')
    })

    test('Debe reconocer un evento de Api Gateway con Body Json', () => {
        //console.log(apiGWContentJsonEvent)

        const input = AbstraLambdaInteractor.makeInput(
            apiGWContentJsonEventGET,
            undefined
        )

        expect(input.eventType).toBe(EventType.API_GATEWAY)
        expect(input.body).toBeInstanceOf(Object)
        expect(input.bodyType).toBe('json')
        expect(input.httpMethod).toBe('GET')
        expect(JSON.stringify(input.pathParameters)).toBe(
            JSON.stringify(input.body)
        )
    })
})
