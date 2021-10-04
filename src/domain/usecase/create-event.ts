import LocationRepository from '../repository/location-repository'
import EventRepository from '../repository/event-repository'
import Location from '../entity/location'
import Event from '../entity/event'

export default class CreateEvent {
    constructor (readonly eventRepository: EventRepository,
        readonly locationRepository: LocationRepository) {}

    async execute (name: string, description: string, location: Location,
        begin: Date, capacity: number): Promise<Event> {
            const event = await this.eventRepository.createEvent(
                name, description, location, begin, capacity)

            if (location.openHour > begin.getHours()) {
                throw new Error('Cannot create an event before location is opened')
            }

            if (location.closeHour < begin.getHours()) {
                throw new Error('Cannot create an event after location has been closed')
            }

            await this.locationRepository.addEvent(location, event)

            return Promise.resolve(event)
    }
}
