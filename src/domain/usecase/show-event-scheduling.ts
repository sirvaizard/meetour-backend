import EventRepository from "../repository/event-repository"
import Event from "../entity/event"
import User from "../entity/user"

export default class ShowEventScheduling {
    constructor (private readonly eventRepository: EventRepository) {}

    async execute (user: User): Promise<Event[]> {
        return this.eventRepository.getUserScheduling(user)
    }
}
