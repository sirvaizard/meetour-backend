import CreateEvent from '../../../src/domain/usecase/create-event'
import EventRepositoryInMemory from '../../../src/infra/repository/event-repository-in-memory'
import LocationRepositoryInMemory from '../../../src/infra/repository/location-repository-in-memory'

describe('#Event', () => {
    it('should be able to create and event with valid params', async () => {
        const eventRepository = new EventRepositoryInMemory()
        const locationRepository = new LocationRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)

        const now = new Date()
        const location = await locationRepository.createLocation('MASP', 'Av. Paulista 123', 1, 1, 8, 18)
        const event = await createEvent.execute('My Event', 'My cool event description', location, now, 100)

        expect(event).toEqual({
            id: '0',
            name: 'My Event',
            description: 'My cool event description',
            location: location,
            begin: now,
            capacity: 100
        })
    })

    it('should add the event to the location\'s events list', async () => {
        const eventRepository = new EventRepositoryInMemory()
        const locationRepository = new LocationRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)

        const now = new Date()
        const location = await locationRepository.createLocation('MASP', 'Av. Paulista 123', 1, 1, 8, 18)
        const event = await createEvent.execute('My Event', 'My cool event description', location, now, 100)

        expect(location.events).toContain(event)
    })
})
