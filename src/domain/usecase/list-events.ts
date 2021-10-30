import Event from "../entity/event";
import EventRepository from "../repository/event-repository";

export default class ListEvents {
    constructor (private readonly eventRepository: EventRepository) {}

    async execute (latitude: number, longitude: number, radius: number): Promise<Event[]> {
        return this.eventRepository.findInsideRadius(latitude, longitude, radius)
    }
}
