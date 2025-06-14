import { jsonrepair } from 'jsonrepair'
export interface AbstraInput {
    body: any
    eventType: EventType
    pathParameters?: object
    headers?: any
    context: any
    httpMethod?: string
    bodyType?: BodyType
    eventRaw?: any
    queryStringParameters?: any
    rawQueryString?: string
    rawPath?: string
    Message?: string
    resource?: string
    path?: string
}

export enum EventType {
    API_GATEWAY = 'API_GATEWAY',
    SNS_EVENT = 'SNS_EVENT',
    S3_EVENT = 'S3_EVENT',
    SQS_EVENT = 'SQS_EVENT',
    DEFAULT = 'DEFAULT',
    LAMBDA_URL = 'LAMBDA_URL',
}

export interface HttpCompatibleResponse {
    statusCode: number
    headers: object
    body: string
}

type BodyType = 'json' | 'xml'

const makeInput = (event, context) => {
    if (typeof event === 'string') {
        console.log(`event es string`)
        const objEvent = stringToJSON(event, undefined)
        const output: AbstraInput = {
            body: objEvent,
            eventType: EventType.DEFAULT,
            context,
            pathParameters: objEvent.pathParameters,
            headers: objEvent.headers,
        }

        return output
    }

    if (
        event.httpMethod !== undefined &&
        event.body !== undefined &&
        event.headers !== undefined
    ) {
        const { body, bodyType } = getBodyFromEvent(event, event.httpMethod)

        const output: AbstraInput = {
            body,
            pathParameters: event.pathParameters,
            queryStringParameters: event.queryStringParameters,
            headers: event.headers,
            eventType: EventType.API_GATEWAY,
            context,
            httpMethod: event.httpMethod,
            bodyType,
            eventRaw: event,
            resource: event.resource,
            path: event.path,
        }

        return output
    }

    if (event.Records && event.Records[0].Sns) {
        const output: AbstraInput = {
            body: stringToJSON(event.Records[0].Sns.Message, event.headers),
            eventType: EventType.SNS_EVENT,
            context,
            eventRaw: event,
            Message: event.Records[0].Sns.Message,
        }
        return output
    }

    if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
        const arrayBody = event.Records.map((record) => {
            return stringToJSON(record.body, event.headers)
        })

        const output: AbstraInput = {
            body: arrayBody,
            eventType: EventType.SQS_EVENT,
            context,
            eventRaw: event,
        }
        return output
    }

    if (event.Records && event.Records[0].s3) {
        const output: AbstraInput = {
            body: event,
            eventType: EventType.S3_EVENT,
            context,
            eventRaw: event,
        }
        return output
    }

    if (event.version && event.routeKey && event.rawPath) {
        const output: AbstraInput = {
            body: JSON.parse(event.body),
            eventType: EventType.LAMBDA_URL,
            context,
            pathParameters: event.pathParameters,
            queryStringParameters: event.queryStringParameters,
            headers: event.headers,
            eventRaw: event,
            rawQueryString: event.rawQueryString,
            rawPath: event.rawPath,
        }

        return output
    }

    const output: AbstraInput = {
        body: event,
        eventType: EventType.DEFAULT,
        context,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
        headers: event.headers,
    }

    return output
}

const getBodyFromEvent = (event, httpMethod: string) => {
    if (
        event.headers['Content-Type'] === 'application/xml' ||
        event.headers['content-type'] === 'application/xml' ||
        event.headers['Content-Type'] === 'text/xml' ||
        event.headers['content-type'] === 'text/xml'
    ) {
        const bodyType: BodyType = 'xml'
        return { body: event.body, bodyType }
    }

    if (httpMethod.toUpperCase() == 'GET') {
        const bodyType: BodyType = 'json'
        return { body: event.pathParameters, bodyType }
    }
    const bodyType: BodyType = 'json'
    return { body: stringToJSON(event.body, event.headers), bodyType }
}

const stringToJSON = (str: string, headers) => {
    try {
        return JSON.parse(str)
    } catch {
        try {
            const jsonRepairedSring = jsonrepair(str)
            return JSON.parse(jsonRepairedSring)
        } catch (e) {
            console.log(`Error parsing string to JSON: ${e}`)
            console.log(`String: ${str}`)
            console.log(`Headers: ${headers}`)
            return { str }
        }
    }
}

export default { makeInput, stringToJSON }
