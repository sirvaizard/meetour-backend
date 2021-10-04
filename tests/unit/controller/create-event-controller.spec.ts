import CreateEvent from "../../../src/domain/usecase/create-event"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import CreateEventController from "../../../src/presentation/controller/create-event-controller"

describe('#Create Event Controller', () => {
    it('Should return 400 if no name is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const now = new Date()
        const payload = {
            body: {
                description: 'My event description',
                location: location,
                begin: now,
                capacity: 50
            }
        }
        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no description is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const now = new Date()
        const payload = {
            body: {
                name: 'My Event',
                location: location,
                begin: now,
                capacity: 50
            }
        }
        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no location is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const now = new Date()
        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                begin: now,
                capacity: 50
            }
        }
        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no begin date is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                capacity: 50
            }
        }
        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no capacity is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const now = new Date()
        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                begin: now
            }
        }
        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    // it.skip('Should return 500 if CreateLocation throws an error', async () => {
    //     const locationRepository = new LocationRepositoryInMemory()
    //     const createLocation = new CreateLocation(locationRepository)
    //     const createLocationController = new CreateLocationController(createLocation)

    //     jest.spyOn(createLocation, 'execute').mockImplementationOnce(async () => {
    //         throw new Error()
    //     })

    //     const payload = {
    //         body: {
    //             name: 'MASP',
    //             address: 'Av. Paulista 123',
    //             latitude: 125,
    //             longitude: 100,
    //             openHour: 8,
    //             closeHour: 18
    //         }
    //     }

    //     const response = await createLocationController.execute(payload)
    //     expect(response.statusCode).toBe(500)
    // })

    it('Should call createEvent with correct values', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const createLocationSpy = jest.spyOn(createEvent, 'execute')

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const now = new Date()
        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                begin: now,
                capacity: 10
            }
        }

        await createEventController.execute(payload)
        expect(createLocationSpy).toHaveBeenCalledWith(
            'My Event', 'My event description', location, now, 10
        )
    })

    it('Should not be able to create an event before the location is opened', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                begin: new Date(2021, 1, 1, 1, 0, 0, 0),
                capacity: 10
            }
        }

        const response = await createEventController.execute(payload)
        expect(response.statusCode).toBe(400)
    })

    it('Should not be able to create an event after the location is closed', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                begin: new Date(2021, 1, 1, 22, 0, 0, 0),
                capacity: 10
            }
        }

        const response = await createEventController.execute(payload)
        expect(response.statusCode).toBe(400)
    })

    it('Should return 201 if valid data is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const eventRepository = new EventRepositoryInMemory()
        const createEvent = new CreateEvent(eventRepository, locationRepository)
        const createEventController = new CreateEventController(createEvent)

        const location = await locationRepository.createLocation(
            'My Event', 'Av. Paulista 123', 10, 10, 8, 18)

        const today = new Date(2021, 1, 1, 12, 0, 0, 0)

        const payload = {
            body: {
                name: 'My Event',
                description: 'My event description',
                location: location,
                begin: today,
                capacity: 10
            }
        }

        const response = await createEventController.execute(payload)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            id: '0',
            name: 'My Event',
            description: 'My event description',
            location: location,
            begin: today,
            capacity: 10,
        })
    })
})
