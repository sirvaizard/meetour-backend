import Location from "../entity/location";
import Event from "../entity/event";
import User from "../entity/user";

export default interface EventRepository {
    createEvent (name: string, description: string, location: Location,
        begin: Date, capacity: number): Promise<Event>

    addAttendee (event: Event, user: User): Promise<boolean>

    findById (id: string): Promise<Event | null | undefined>

    findInsideRadius (latitude: number, longitude: number, radius: number): Promise<Event[]>

    getUserScheduling (user: User): Promise<Event[]>

    getAttendees (event: Event): Promise<User[]>
}
