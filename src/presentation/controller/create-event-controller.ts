import CreateEvent from "../../domain/usecase/create-event";
import Controller from "../protocols/controller";
import httpRequest from "../protocols/http-request";
import httpResponse from "../protocols/http-response";

export default class CreateEventController implements Controller {
    constructor (readonly createEvent: CreateEvent) {}

    async execute(httpRequest: httpRequest): Promise<httpResponse> {
        const requiredFields = ['name', 'description', 'location', 'begin', 'capacity']

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
            const { name, description, location, begin, capacity } = httpRequest.body
            const event = await this.createEvent.execute(name, description, location, new Date(begin), capacity)

            return Promise.resolve({
                statusCode: 201,
                body: event
            })
        } catch (error) {
            return Promise.resolve({
                statusCode: 400,
                body: error
            })
        }
    }
}
