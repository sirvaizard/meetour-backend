import EventRepositoryInMemory from "../../../src/infra/repository/event-repository-in-memory"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import ShowEventScheduling from "../../../src/domain/usecase/show-event-scheduling"
import CreateUser from "../../../src/domain/usecase/create-user"
import Hash from "../../../src/domain/ports/hash"
import ShowEventSchedulingController from "../../../src/presentation/controller/show-event-scheduling-controller"

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
    createUser: CreateUser
    showEventSchedulingController: ShowEventSchedulingController
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const eventRepository = new EventRepositoryInMemory()
    const showEventScheduling = new ShowEventScheduling(eventRepository)
    const showEventSchedulingController = new ShowEventSchedulingController(userRepository, showEventScheduling)

    return {
        createUser,
        showEventSchedulingController
    }
}

describe('Show Event Scheduling Controller', () => {
    it('should return 200', async () => {
        const { showEventSchedulingController, createUser } = makeSut()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com', 'pass', '8888888888', new Date(), 'bio')

        const payload = {
            body: {
                userId: user.id
            }
        }

        const response = await showEventSchedulingController.execute(payload)

        expect(response.statusCode).toBe(200)
    })
})
