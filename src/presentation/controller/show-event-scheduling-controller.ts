import UserRepository from "../../domain/repository/user-repository";
import ShowEventScheduling from "../../domain/usecase/show-event-scheduling";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class ShowEventSchedulingController implements Controller {
    constructor (private readonly userRepository: UserRepository,
        private readonly showEventScheduling: ShowEventScheduling) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { userId: id } = httpRequest.body

        const user = await this.userRepository.findById(id)

        if (user) {
            const events = await this.showEventScheduling.execute(user)
            return Promise.resolve({
                statusCode: 200,
                body: events
            })
        }

        return Promise.resolve({
            statusCode: 400,
            body: {
                error: 'bad request'
            }
        })
    }

}
