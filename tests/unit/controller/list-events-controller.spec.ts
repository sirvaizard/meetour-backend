import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import ListEventsController from '../../../src/presentation/controller/list-events-controller'
import CreateLocation from "../../../src/domain/usecase/create-location"
import CreateEvent from "../../../src/domain/usecase/create-event"
import ListEvents from "../../../src/domain/usecase/list-events"

interface SutType {
    createLocation: CreateLocation
    createEvent: CreateEvent
    listEventsController: ListEventsController
}

const makeSut = (): SutType => {
    const locationRepository = new LocationRepositoryInMemory()
    const eventRepository = new EventRepositoryInMemory()
    const createLocation = new CreateLocation(locationRepository)
    const createEvent = new CreateEvent(eventRepository, locationRepository)
    const listEvents = new ListEvents(eventRepository)
    const listEventsController = new ListEventsController(listEvents)

    return {
        createLocation,
        createEvent,
        listEventsController
    }
}

describe('#List Events Controller', () => {
    it('should return 400 if latitude is not provided', async () => {
        const { listEventsController } = makeSut()

        const payload = {
            body: {
                longitude: 10,
                radius: 10
            }
        }

        const response = await listEventsController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if longitude is not provided', async () => {
        const { listEventsController } = makeSut()

        const payload = {
            body: {
                latitude: 10,
                radius: 10
            }
        }

        const response = await listEventsController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if radius is not provided', async () => {
        const { listEventsController } = makeSut()

        const payload = {
            body: {
                latitude: 10,
                longitude: 10
            }
        }

        const response = await listEventsController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 200 if valid arguments are passed', async() => {
        const { listEventsController } = makeSut()

        const payload = {
            body: {
                latitude: 10,
                longitude: 10,
                radius: 10
            }
        }

        const response = await listEventsController.execute(payload)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([])
    })
})
