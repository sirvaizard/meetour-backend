import Hash from "../../../src/domain/ports/hash"
import CreateUser from "../../../src/domain/usecase/create-user"
import ShowUser from "../../../src/domain/usecase/show-user"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import ShowUserController from "../../../src/presentation/controller/show-user-controller"

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
    showUserController: ShowUserController
    createUser: CreateUser
}

const makeSut = (): SutType => {
    const userRepository = new UserRepositoryInMemory()
    const hash = makeHash()
    const createUser = new CreateUser(userRepository, hash)
    const showUser = new ShowUser(userRepository)
    const showUserController = new ShowUserController(showUser)

    return {
        showUserController,
        createUser
    }
}

describe('#Show User Controller', () => {
    it('should return 400 if no id is provided', async () => {
        const { showUserController } = makeSut()

        const payload = {
            params: {

            }
        }

        const response = await showUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 200 if user exists', async () => {
        const { showUserController, createUser } = makeSut()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com', 'asdas',
            '77777777777', new Date())

        const payload = {
            params: {
                id: user.id
            }
        }

        const response = await showUserController.execute(payload)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(user.id)
    })

    it('should return 404 if user does not exists', async () => {
        const { showUserController } = makeSut()

        const payload = {
            params: {
                id: 'invalid id'
            }
        }

        const response = await showUserController.execute(payload)

        expect(response.statusCode).toBe(404)
        expect(response.body).toBe(null)
    })
})
