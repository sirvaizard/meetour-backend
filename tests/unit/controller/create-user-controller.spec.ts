import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import CreateUserController from "../../../src/presentation/controller/create-user-controller"
import CreateUser from "../../../src/domain/usecase/create-user"
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
    createUserController: CreateUserController
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const createUserController = new CreateUserController(createUser)

    return {
        createUserController
    }
}

describe('#Create User Controller', () => {
    it('should return 400 if no name is provided', async () => {
        const { createUserController } = makeSut()

        const payload = {
            body: {
                email: 'john.doe@mail.com',
                password: 'validpassword',
                cpf: 'validcpf',
                birth: new Date()
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if no email is provided', async () => {
        const { createUserController } = makeSut()

        const payload = {
            body: {
                name: 'John Doe',
                password: 'validpassword',
                cpf: 'validcpf',
                birth: new Date()
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if no password is provided', async () => {
        const { createUserController } = makeSut()

        const payload = {
            body: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
                cpf: 'validcpf',
                birth: new Date()
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if no cpf is provided', async () => {
        const { createUserController } = makeSut()

        const payload = {
            body: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
                password: 'validpassword',
                birth: new Date()
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if no birth is provided', async () => {
        const { createUserController } = makeSut()

        const payload = {
            body: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
                password: 'validpassword',
                cpf: 'validcpf'
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('should return 201 if valid data is provided', async () => {
        const { createUserController } = makeSut()
        const now = new Date()
        const payload = {
            body: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
                password: 'validpassword',
                cpf: 'validcpf',
                birth: now
            }
        }

        const response = await createUserController.execute(payload)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            id: '0',
            name: 'John Doe',
            email: 'john.doe@mail.com',
            password: 'validpassword',
            cpf: 'validcpf',
            birth: now
        })
    })
})

