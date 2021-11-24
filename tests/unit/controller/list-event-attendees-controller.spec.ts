import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import ListEventAttendeesController from "../../../src/presentation/controller/list-event-attendees-controller"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import ListEventAttendees from "../../../src/domain/usecase/list-event-atteendees"
import CreateLocation from "../../../src/domain/usecase/create-location"
import CreateEvent from "../../../src/domain/usecase/create-event"

interface SutType {
    listEventAttendeesController: ListEventAttendeesController
    createLocation: CreateLocation
    createEvent: CreateEvent
}

const makeSut = (): SutType => {
    const eventRepository = new EventRepositoryInMemory()
    const locationRepository = new LocationRepositoryInMemory()
    const createLocation = new CreateLocation(locationRepository)
    const createEvent = new CreateEvent(eventRepository, locationRepository)
    const listEventAttendees = new ListEventAttendees(eventRepository)
    const listEventAttendeesController = new ListEventAttendeesController(listEventAttendees)

    return {
        listEventAttendeesController,
        createEvent,
        createLocation
    }
}

describe('#List Event Attendees Controller', () => {
    it('should return 400 if no event id is provided', async () => {
        const { listEventAttendeesController } = makeSut()

        const payload = {
            params: {
            }
        }

        const response = await listEventAttendeesController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 200 and a list if valid data is provided', async () => {
        const { listEventAttendeesController, createLocation, createEvent } = makeSut()

        const location = await createLocation.execute('Location', 'Address', 10, 10, 0, 23, 'url')
        const event = await createEvent.execute('Event', 'Description', location.id,
            new Date(), 50)

        const payload = {
            params: {
                id: event.id
            }
        }

        const response = await listEventAttendeesController.execute(payload)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })
})
