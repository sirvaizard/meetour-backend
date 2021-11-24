import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import User from "../../domain/entity/user";
import EventRepository from "../../domain/repository/event-repository";

export default class EventRepositoryInMemory implements EventRepository {
    private readonly events: Event[]

    constructor () {
        this.events = []
    }

    getAttendees(event: Event): Promise<User[]> {
        return Promise.resolve(event.getAttendees())
    }

    getUserScheduling(user: User): Promise<Event[]> {
        return Promise.resolve(this.events.filter((event) => event.hasAttendee(user)))
    }

    findInsideRadius(latitude: number, longitude: number, radius: number): Promise<Event[]> {
        return Promise.resolve(this.events.filter((event) => {
            return Math.sqrt(((latitude - event.location.latitude) ** 2) + ((longitude - event.location.longitude) ** 2)) <= radius &&
                event.begin >= new Date()
        }))
    }

    findById(id: string): Promise<Event | null | undefined> {
        return Promise.resolve(this.events.find((event) => event.id === id))
    }
    addAttendee(event: Event, user: User): Promise<boolean> {
        return Promise.resolve(true)
    }

    createEvent(name: string, description: string, location: Location, begin: Date, capacity: number): Promise<Event> {
        const event = new Event(String(this.events.length), name, description, location, begin, capacity)
        this.events.push(event)
        return Promise.resolve(event)
    }

}
