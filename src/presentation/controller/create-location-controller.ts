import CreateLocation from '../../domain/usecase/create-location'
import Controller from '../protocols/controller'
import HttpRequest from '../protocols/http-request'
import HttpResponse from '../protocols/http-response'

export default class CreateLocationController implements Controller {
    constructor (readonly createLocation: CreateLocation) {}

    execute (HttpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['name', 'address', 'latitude', 'longitude',
            'openHour', 'closeHour']

        const missingFields = []
        for (const field of requiredFields) {
            if (!HttpRequest.body[field]) {
                missingFields.push(field)
            }
        }

        if (missingFields.length !== 0) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        return Promise.resolve({
            statusCode: 200,
            body: ''
        })
    }
}
