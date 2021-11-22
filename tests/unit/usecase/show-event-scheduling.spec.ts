import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import ShowEventScheduling from "../../../src/domain/usecase/show-event-scheduling"
import EventRepository from "../../../src/domain/repository/event-repository"
import CreateLocation from "../../../src/domain/usecase/create-location"
import CreateEvent from "../../../src/domain/usecase/create-event"
import CreateUser from "../../../src/domain/usecase/create-user"
import JoinEvent from "../../../src/domain/usecase/join-event"
import Hash from "../../../src/domain/ports/hash"

const makeHash = (): Hash => {
    class HashStub implements Hash {
        hash(text: string): Promise<string> {
            return Promise.resolve(text)
        }
        compare(text: string, hash: string): Promise<boolean> {
            return Promise.resolve(true)
        }
    }

    return new HashStub()
}

interface SutType {
    joinEvent: JoinEvent
    createUser: CreateUser
    createLocation: CreateLocation
    createEvent: CreateEvent
    eventRepository: EventRepository
    showEventScheduling: ShowEventScheduling
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const eventRepository = new EventRepositoryInMemory()
    const locationRepository = new LocationRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const createEvent = new CreateEvent(eventRepository, locationRepository)
    const createLocation = new CreateLocation(locationRepository)
    const joinEvent = new JoinEvent(eventRepository)
    const showEventScheduling = new ShowEventScheduling(eventRepository)

    return {
        joinEvent,
        createUser,
        createEvent,
        createLocation,
        eventRepository,
        showEventScheduling
    }
}

describe('#Show Event Scheduling', () => {
    it('should not list events that were not confirmed by user', async () => {
        const { createUser, createLocation, createEvent, showEventScheduling } = makeSut()

        const location = await createLocation.execute('Location', 'Address', 10, 10, 1, 23, 'image')
        await createEvent.execute('Event', 'Description', location.id, new Date(), 50)
        const user = await createUser.execute('John Doe', 'john.doe@mail.com', 'pass', '99999999999', new Date())

        const events = await showEventScheduling.execute(user)

        expect(events).toHaveLength(0)
    })

    it('should list events that were confirmed by user', async () => {
        const { createUser, createLocation, createEvent, showEventScheduling, joinEvent } = makeSut()

        const location = await createLocation.execute('Location', 'Address', 10, 10, 1, 23, 'image')
        const event = await createEvent.execute('Event', 'Description', location.id, new Date(), 50)
        const user = await createUser.execute('John Doe', 'john.doe@mail.com', 'pass', '99999999999', new Date())

        await joinEvent.execute(event, user)

        const events = await showEventScheduling.execute(user)

        expect(events).toHaveLength(1)
        expect(events).toContain(event)
    })
})
