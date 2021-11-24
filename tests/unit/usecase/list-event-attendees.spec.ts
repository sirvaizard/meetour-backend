import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import ListEventAttendees from "../../../src/domain/usecase/list-event-atteendees"
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
    listEventAttendees: ListEventAttendees
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
    const listEventAttendees = new ListEventAttendees(eventRepository)

    return {
        joinEvent,
        createUser,
        createEvent,
        createLocation,
        listEventAttendees
    }
}

describe('#List Event Attendees', () => {
    it('should return all attendees confirmed for a given event', async () => {
        const { createUser, createLocation, createEvent, joinEvent, listEventAttendees } = makeSut()

        const user = await createUser.execute('John Doe', 'john@mail.com',
            'pass', '8888888888', new Date())

        const location = await createLocation.execute('Location', 'Address', 10, 10, 0, 23, 'url')
        const event = await createEvent.execute('Event', 'Description', location.id,
            new Date(), 50)

        await joinEvent.execute(event, user)

        const attendees = await listEventAttendees.execute(event.id)

        expect(attendees).toContain(user)
    })
})
