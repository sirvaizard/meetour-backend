import Location from "../entity/location";
import Event from "../entity/event";

export default interface EventRepository {
    createEvent (name: string, description: string, location: Location,
        begin: Date, capacity: number): Promise<Event>
}
