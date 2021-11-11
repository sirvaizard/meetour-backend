import Location from '../entity/location'
import Event from '../entity/event'

export default interface LocationRepository {
    createLocation (name: string, address: string, latitude: number, longitude: number, openHour: number, closeHour: number): Promise<Location>
    getLocation (id: string): Promise<Location | null>
    addEvent (location: Location, event: Event): Promise<void>
}
