import AbstraOutput, { AbstraOutputParams } from './AbstraOutput'

describe('Name of the group', () => {
    let cut

    beforeEach(() => {})

    test('Name of the group', () => {
        const input: AbstraOutputParams = {
            statusCode: 200,
            body: {},
            enableCORS: true,
            bodyXML: '<xml></xml>',
            headersExtra: {
                'Access-Control-Allow-Headers':
                    'Content-Type, Authorization, idImpreso',
            },
        }

        const resp = AbstraOutput(input)

        //console.log(resp)

        expect(resp.headers['Access-Control-Allow-Headers']).toContain(
            'idImpreso'
        )
    })

    test('Name of the group', () => {
        const input: AbstraOutputParams = {
            statusCode: 200,
            body: {},
            enableCORS: true,
            headersExtra: {
                'Access-Control-Allow-Headers':
                    'Content-Type, Authorization, idImpreso',
            },
        }

        const resp = AbstraOutput(input)

        //console.log(resp)

        expect(resp.headers['Access-Control-Allow-Headers']).toContain(
            'idImpreso'
        )
    })
})
