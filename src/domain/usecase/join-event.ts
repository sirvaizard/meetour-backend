import EventRepository from "../repository/event-repository";
import Event from "../entity/event";
import User from "../entity/user";

export default class JoinEvent {
    constructor (private readonly eventRepository: EventRepository) {}

    async execute (event: Event, user: User): Promise<void> {
        if (event.hasAttendee(user)) {
            // TODO: handle this error better
            throw new Error()
        }

        if (event.isFull()) {
            // TODO: handle this error better
            throw new Error()
        }

        if (event.begin < new Date()) {
            // TODO: handle this error better
            throw new Error()
        }

        await this.eventRepository.addAttendee(event, user)
        event.addAttendee(user)

        return Promise.resolve()
    }
}
