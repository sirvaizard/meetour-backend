import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import EventRepository from "../../../src/domain/repository/event-repository"
import CreateLocation from "../../../src/domain/usecase/create-location"
import CreateEvent from "../../../src/domain/usecase/create-event"
import ListEvents from "../../../src/domain/usecase/list-events"

interface SutType {
    eventRepository: EventRepository
    createLocation: CreateLocation
    createEvent: CreateEvent
    listEvents: ListEvents
}

const makeSut = (): SutType => {
    const eventRepository = new EventRepositoryInMemory()
    const locationRepository = new LocationRepositoryInMemory()
    const createEvent = new CreateEvent(eventRepository, locationRepository)
    const createLocation = new CreateLocation(locationRepository)
    const listEvents = new ListEvents(eventRepository)

    return {
        createEvent,
        createLocation,
        eventRepository,
        listEvents
    }
}

describe('#List Events', () => {
    it('should not return events outside radius', async () => {
        const { createLocation, createEvent, listEvents } = makeSut()

        const validDate = new Date()
        validDate.setHours(15)

        const location = await createLocation.execute('My Local', '5th Ave.', 500, 500, 8, 23, 'image')
        await createEvent.execute('My Event', 'Event Desc', location.id, validDate, 100)

        const events = await listEvents.execute(100, 100, 100)

        expect(events).toHaveLength(0)
    })

    it('should return events inside radius', async () => {
        const { createLocation, createEvent, listEvents } = makeSut()

        const validDate = new Date()
        validDate.setDate(validDate.getDate() + 1)
        validDate.setHours(15)

        const location = await createLocation.execute('My Local', '5th Ave.', 500, 500, 8, 23, 'image')
        const event = await createEvent.execute('My Event', 'Event Desc', location.id, validDate, 100)

        const events = await listEvents.execute(450, 450, 100)

        expect(events).toHaveLength(1)
        expect(events).toContain(event)
    })

    it('should not return events that already happened', async () => {
        const { createLocation, createEvent, listEvents } = makeSut()

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(15)

        const location = await createLocation.execute('My Local', '5th Ave.', 500, 500, 8, 23, 'image')
        await createEvent.execute('My Event', 'Event Desc', location.id, yesterday, 100)

        const events = await listEvents.execute(450, 450, 100)

        expect(events).toHaveLength(0)
    })
})
