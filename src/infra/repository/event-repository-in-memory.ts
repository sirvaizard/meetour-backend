import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import EventRepository from "../../domain/repository/event-repository";

export default class EventRepositoryInMemory implements EventRepository {
    private readonly events: Event[]

    constructor () {
        this.events = []
    }

    createEvent(name: string, description: string, location: Location, begin: Date, capacity: number): Promise<Event> {
        const event = new Event(String(this.events.length), name, description, location, begin, capacity)
        return Promise.resolve(event)
    }

}
