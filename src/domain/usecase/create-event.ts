import LocationRepository from '../repository/location-repository'
import EventRepository from '../repository/event-repository'
import Event from '../entity/event'

export default class CreateEvent {
    constructor (readonly eventRepository: EventRepository,
        readonly locationRepository: LocationRepository) {}

    async execute (name: string, description: string, location: string,
        begin: Date, capacity: number): Promise<Event> {
            const locationExists = await this.locationRepository.getLocation(location)

            if (!locationExists) {
                throw new Error('Cannot create an event in a location that does not exists')
            }
            if (locationExists.openHour > begin.getHours()) {
                throw new Error('Cannot create an event before location is opened')
            }

            if (locationExists.closeHour < begin.getHours()) {
                throw new Error('Cannot create an event after location has been closed')
            }

            const event = await this.eventRepository.createEvent(
                name, description, locationExists, begin, capacity)

            await this.locationRepository.addEvent(locationExists, event)

            return Promise.resolve(event)
    }
}
