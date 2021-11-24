import EventRepository from "../repository/event-repository"
import Event from "../entity/event"
import User from "../entity/user"

export default class ListEventAttendees {
    constructor (private readonly eventRepository: EventRepository) {}

    async execute (eventId: string): Promise<User[]> {
        const event = await this.eventRepository.findById(eventId)

        if (!event) {
            throw new Error('Event does not exists')
        }

        const attendees = await this.eventRepository.getAttendees(event)

        return Promise.resolve(attendees)
    }
}
