import CreateLocation from '../../domain/usecase/create-location'
import Controller from '../protocols/controller'
import HttpRequest from '../protocols/http-request'
import HttpResponse from '../protocols/http-response'

export default class CreateLocationController implements Controller {
    constructor (readonly createLocation: CreateLocation) {}

    async execute (httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['name', 'address', 'latitude', 'longitude',
            'openHour', 'closeHour']

        const missingFields = []
        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
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

        try {
            const { name, address, latitude, longitude, openHour, closeHour, image } = httpRequest.body
            const location = await this.createLocation.execute(name, address, latitude,
                longitude, openHour, closeHour, image)

            return Promise.resolve({
                statusCode: 201,
                body: location
            })
        } catch {
            return Promise.resolve({
                statusCode: 500,
                body: new Error()
            })
        }
    }
}
