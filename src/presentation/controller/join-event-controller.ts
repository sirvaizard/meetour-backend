import EventRepository from '../../domain/repository/event-repository';
import UserRepository from '../../domain/repository/user-repository';
import JoinEvent from '../../domain/usecase/join-event';
import Controller from '../protocols/controller'
import HttpRequest from '../protocols/http-request';
import HttpResponse from '../protocols/http-response';

export default class JoinEventController implements Controller {
    constructor (private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository,
        private readonly joinEvent: JoinEvent) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body || !httpRequest.body.userId || !httpRequest.params || !httpRequest.params.id) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        const { userId } = httpRequest.body

        const user = await this.userRepository.findById(userId)
        if (!user) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        const { id: eventId } = httpRequest.params

        const event = await this.eventRepository.findById(eventId)
        if (!event) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        await this.joinEvent.execute(event, user)

        return Promise.resolve({
            statusCode: 201,
            body: {}
        })
    }

}
