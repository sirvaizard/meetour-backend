import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import LocationRepository from "../../domain/repository/location-repository";

export default class LocationRepositoryInMemory implements LocationRepository {
    private readonly locations: Location[]

    constructor () {
        this.locations = []
    }

    async createLocation(name: string, address: string, latitude: number, longitude: number, openHour: number, closeHour: number): Promise<Location> {
        const location = new Location(String(this.locations.length), name, address,
            longitude, latitude, openHour, closeHour)

        this.locations.push(location)

        return Promise.resolve(location)
    }
    async getLocation(id: string): Promise<Location | null> {
        const location = this.locations.find((location) => location.id === id)

        if (location) {
            return Promise.resolve(location)
        }

        return null
    }

    async addEvent(location: Location, event: Event): Promise<void> {
        location.events.push(event)
    }
}
