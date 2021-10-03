import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import LocationRepository from "../../domain/repository/location-repository";

export default class LocationRepositoryInMemory implements LocationRepository {
    private locations: Location[]

    constructor () {
        this.locations = []
    }

    async createLocation(name: string, address: string, latitude: number, longitude: number, openHour: number, closeHour: number): Promise<Location> {
        const location = new Location(String(this.locations.length), name, address,
            longitude, latitude, openHour, closeHour)

        this.locations.push(location)

        return Promise.resolve(location)
    }
    async getLocation(id: string): Promise<Location> {
        throw new Error("Method not implemented.")
    }
    async getEvents(location: string | Location): Promise<Event[]> {
        throw new Error("Method not implemented.")
    }
    async addEvent(location: Location, event: Event): Promise<Event[]> {
        location.events.push(event)

        return Promise.resolve(location.events)
    }
}
