import { HttpCompatibleResponse } from './AbstraLambdaInteractor'

export interface AbstraOutputParams {
    statusCode: number
    body: object
    enableCORS: boolean
    bodyXML?: string
    headersExtra?: object
}

export default (input: AbstraOutputParams) => {
    const { statusCode, body, enableCORS, bodyXML } = input

    const headersExtraOK = input.headersExtra || {}

    const cors = enableCORS
        ? {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        : {}

    if (bodyXML) {
        const resp: HttpCompatibleResponse = {
            statusCode,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                ...cors,
                ...headersExtraOK,
            },
            body: bodyXML,
        }
        return resp
    }

    const resp: HttpCompatibleResponse = {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...cors,
            ...headersExtraOK,
        },
        body: JSON.stringify(body),
    }

    return resp
}
