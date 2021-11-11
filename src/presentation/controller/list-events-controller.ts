import ListEvents from "../../domain/usecase/list-events";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class ListEventsController implements Controller {
    constructor (private readonly listEvents: ListEvents) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['latitude', 'longitude', 'radius']

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

        const { latitude, longitude, radius } = httpRequest.body

        const events = await this.listEvents.execute(latitude, longitude, radius)

        return Promise.resolve({
            statusCode: 200,
            body: events
        })
    }

}
