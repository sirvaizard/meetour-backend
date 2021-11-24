import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
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

    return {
        joinEvent,
        createUser,
        createEvent,
        createLocation,
        eventRepository
    }
}
describe('#Join Event', () => {
    it('should be able for a user to join an event', async () => {
        const { joinEvent, createUser, createEvent, createLocation } = makeSut()

        const location = await createLocation.execute('Location 1', 'Main Av.', 25, 25, 8, 18, 'image')
        const validTime = new Date()
        validTime.setDate(validTime.getDate() + 1)
        validTime.setHours(12)
        const event = await createEvent.execute('Event 1', 'My event 1', location.id, validTime, 100)
        const user = await createUser.execute('John Doe', 'john.doe@mail.com', '111111', '999999', new Date(), 'bio')

        await joinEvent.execute(event, user)

        expect(event.hasAttendee(user)).toBe(true)
    })

    it('should not be able to insert an user twice in the same event', async () => {
        const { joinEvent, createUser, createEvent, createLocation } = makeSut()

        const location = await createLocation.execute('Location 1', 'Main Av.', 25, 25, 8, 18, 'image')
        const validTime = new Date()
        validTime.setDate(validTime.getDate() + 1)
        validTime.setHours(12)
        const event = await createEvent.execute('Event 1', 'My event 1', location.id, validTime, 100)
        const user = await createUser.execute('John Doe', 'john.doe@mail.com', '111111', '999999', new Date(), 'bio')

        await joinEvent.execute(event, user)

        let error
        try {
            await joinEvent.execute(event, user)
        } catch (e) {
            error = e
        }

        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(Error)
    })

    it('should not be able to insert an user in an event at full capacity', async () => {
        const { joinEvent, createUser, createEvent, createLocation } = makeSut()

        const location = await createLocation.execute('Location 1', 'Main Av.', 25, 25, 8, 18, 'image')
        const validTime = new Date()
        validTime.setDate(validTime.getDate() + 1)
        validTime.setHours(12)
        const event = await createEvent.execute('Event 1', 'My event 1', location.id, validTime, 1)

        await joinEvent.execute(event,
            await createUser.execute('John Doe', 'john.doe@mail.com', '111111', '999999', new Date(), 'bio'))

        let error
        try {
            await joinEvent.execute(event,
                await createUser.execute('Jane Doe', 'jane.doe@mail.com', '111111', '999998', new Date(), 'bio'))
        } catch (e) {
            error = e
        }

        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(Error)
    })

    it('should not be able to insert an user in an event that has already happened', async () => {
        const { joinEvent, createUser, createEvent, createLocation } = makeSut()

        const location = await createLocation.execute('Location 1', 'Main Av.', 25, 25, 8, 18, 'image')
        const validTime = new Date()
        validTime.setDate(validTime.getDate() - 1)
        validTime.setHours(12)
        const event = await createEvent.execute('Event 1', 'My event 1', location.id, validTime, 1)

        let error
        try {
            await joinEvent.execute(event,
                await createUser.execute('Jane Doe', 'jane.doe@mail.com', '111111', '999998', new Date(), 'bio'))
        } catch (e) {
            error = e
        }

        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(Error)
    })
})
