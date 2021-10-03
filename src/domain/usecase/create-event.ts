import LocationRepository from '../repository/location-repository'
import EventRepository from '../repository/event-repository'
import Location from '../entity/location'
import Event from '../entity/event'

export default class CreateEvent {
    constructor (readonly eventRepository: EventRepository,
        readonly locationRepository: LocationRepository) {}

    async execute (name: string, description: string, location: Location,
        begin: Date, capacity: number): Promise<Event> {
            const event = await this.eventRepository.createEvent(name, description, location,
                begin, capacity)

            await this.locationRepository.addEvent(location, event)

            return Promise.resolve(event)
    }
}
