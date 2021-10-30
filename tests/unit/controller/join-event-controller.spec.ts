import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import JoinEventController from "../../../src/presentation/controller/join-event-controller"
import CreateLocation from "../../../src/domain/usecase/create-location"
import CreateEvent from "../../../src/domain/usecase/create-event"
import CreateUser from "../../../src/domain/usecase/create-user"
import JoinEvent from "../../../src/domain/usecase/join-event"
import Hash from "../../../src/domain/ports/hash"

const makeHash = (): Hash => {
    class HashStub implements Hash {
        async hash(text: string): Promise<string> {
            return Promise.resolve(text)
        }
        async compare(text: string, hash: string): Promise<boolean> {
            return Promise.resolve(true)
        }
    }

    return new HashStub()
}

interface SutType {
    createLocation: CreateLocation
    createEvent: CreateEvent
    createUser: CreateUser
    joinEvent: JoinEvent
    joinEventController: JoinEventController
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const locationRepository = new LocationRepositoryInMemory()
    const eventRepository = new EventRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const createLocation = new CreateLocation(locationRepository)
    const createEvent = new CreateEvent(eventRepository, locationRepository)
    const joinEvent = new JoinEvent(eventRepository)
    const joinEventController = new JoinEventController(userRepository, eventRepository)

    return {
        createLocation,
        createEvent,
        createUser,
        joinEvent,
        joinEventController,
    }
}

describe('#Join Event Controller', () => {
    it('should return 400 if user is not provided', async () => {
        const { joinEventController } = makeSut()

        const payload = {
            body: {}
        }

        const response = await joinEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if user does not exists', async () => {
        const { joinEventController } = makeSut()

        const payload = {
            body: {
                userId: 'invalid user id'
            }
        }

        const response = await joinEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if event is not provided', async () => {
        const { joinEventController, createUser } = makeSut()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com', '123123', '12312312312', new Date())

        const payload = {
            body: {
                userId: user.id
            }
        }

        const response = await joinEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if event does not exists', async () => {
        const { joinEventController, createUser } = makeSut()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com', '123123', '12312312312', new Date())

        const payload = {
            body: {
                userId: user.id,
                eventId: 'invalid event id'
            }
        }

        const response = await joinEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 201 if user successfully joins an event', async () => {
        const { joinEventController, createUser, createLocation, createEvent } = makeSut()

        const validDate = new Date()
        validDate.setHours(15)

        const location = await createLocation.execute('Location A', '5th Av.', 20, 20, 8, 22)
        const event = await createEvent.execute('Event A', 'My Event A', location, validDate, 50)
        const user = await createUser.execute('John Doe', 'john.doe@mail.com', '123123', '12312312312', new Date())

        const payload = {
            body: {
                userId: user.id,
                eventId: event.id
            }
        }

        const response = await joinEventController.execute(payload)

        expect(response.statusCode).toBe(400)
    })
})
