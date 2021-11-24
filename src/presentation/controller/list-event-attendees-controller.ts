import ListEventAttendees from "../../domain/usecase/list-event-atteendees";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class ListEventAttendeesController implements Controller {
    constructor (private readonly listEventAttendees: ListEventAttendees) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { id } = httpRequest.params

        if (!id) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'bad request'
                }
            })
        }

        const attendees = await this.listEventAttendees.execute(id)

        return Promise.resolve({
            statusCode: 200,
            body: attendees
        })
    }

}
