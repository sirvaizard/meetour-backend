import CreateEvent from '../../../src/domain/usecase/create-event'
import EventRepositoryInMemory from '../../../src/infra/repository/event-repository-in-memory'
import LocationRepositoryInMemory from '../../../src/infra/repository/location-repository-in-memory'

describe('#Event', () => {
    it('should be able to create and event with valid params', async () => {
        const eventRepository = new EventRepositoryInMemory()
        const locationRepository = new LocationRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)

        const today = new Date()
        today.setHours(12)

        const location = await locationRepository.createLocation('MASP', 'Av. Paulista 123', 1, 1, 8, 18)
        const event = await createEvent.execute('My Event', 'My cool event description', location, today, 100)

        expect(event.id).toEqual('0')
        expect(event.name).toEqual('My Event')
        expect(event.description).toEqual('My cool event description')
        expect(event.begin).toEqual(today)
        expect(event.capacity).toEqual(100)
    })

    it('should add the event to the location\'s events list', async () => {
        const eventRepository = new EventRepositoryInMemory()
        const locationRepository = new LocationRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)

        const today = new Date()
        today.setHours(12)

        const location = await locationRepository.createLocation('MASP', 'Av. Paulista 123', 1, 1, 8, 18)
        const event = await createEvent.execute('My Event', 'My cool event description', location, today, 100)

        expect(location.events).toContain(event)
    })
})
