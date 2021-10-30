import EventRepository from '../../domain/repository/event-repository';
import UserRepository from '../../domain/repository/user-repository';
import Controller from '../protocols/controller'
import HttpRequest from '../protocols/http-request';
import HttpResponse from '../protocols/http-response';

export default class JoinEventController implements Controller {
    constructor (private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body || !httpRequest.body.userId || !httpRequest.body.eventId) {
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

        const { eventId } = httpRequest.body

        const event = await this.eventRepository.findById(eventId)
        if (!event) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        return Promise.resolve({
            statusCode: 0,
            body: {
                error: 'Bad request'
            }
        })
    }

}
