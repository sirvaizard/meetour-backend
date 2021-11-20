import Location from "../entity/location";
import LocationRepository from "../repository/location-repository";

export default class CreateLocation {
    constructor (readonly locationRepository: LocationRepository) {}

    async execute (name: string, address: string, latitude: number,
        longitude: number, openHour: number, closeHour: number, image: string): Promise<Location> {
            return this.locationRepository.createLocation(name, address, latitude,
                longitude, openHour, closeHour, image)
    }
}
