import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import User from "../../domain/entity/user";
import EventRepository from "../../domain/repository/event-repository";

export default class EventRepositoryInMemory implements EventRepository {
    private readonly events: Event[]

    constructor () {
        this.events = []
    }
    findById(id: string): Promise<Event | null | undefined> {
        return Promise.resolve(this.events.find((event) => event.id === id))
    }
    addAttendee(event: Event, user: User): Promise<boolean> {
        return Promise.resolve(true)
    }

    createEvent(name: string, description: string, location: Location, begin: Date, capacity: number): Promise<Event> {
        const event = new Event(String(this.events.length), name, description, location, begin, capacity)
        return Promise.resolve(event)
    }

}
