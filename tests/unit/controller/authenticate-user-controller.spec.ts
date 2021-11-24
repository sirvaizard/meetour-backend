import Hash from "../../../src/domain/ports/hash"
import Token from "../../../src/domain/ports/token"
import AuthenticateUser from "../../../src/domain/usecase/authenticate-user"
import CreateUser from "../../../src/domain/usecase/create-user"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import AuthenticateUserController from "../../../src/presentation/controller/authenticate-user-controller"

const makeToken = (): Token => {
    class TokenStub implements Token {
        generate (payload: any, secret: string): string {
            return 'tokentokentoken'
        }

        async verify (token: string, secret: string): Promise<string | null> {
            return Promise.resolve('id')
        }
    }

    return new TokenStub()
}

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
    hash: Hash
    createUser: CreateUser,
    authenticateUserController: AuthenticateUserController
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const token = makeToken()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const authenticateUser = new AuthenticateUser(userRepository, hash, token, 'secret')
    const authenticateUserController = new AuthenticateUserController(authenticateUser)

    return {
        hash,
        createUser,
        authenticateUserController
    }
}

describe('#Authenticate User Controller', () => {
    it('should return 400 if no email is provided', async () => {
        const { authenticateUserController } = makeSut()
        const payload = {
            body: {
                password: 'psss'
            }
        }

        let response
        try {
            response = await authenticateUserController.execute(payload)
        } catch (error) {}

        expect(response?.statusCode).toBe(400)
    })

    it('should return 400 if no password is provided', async () => {
        const { authenticateUserController } = makeSut()
        const payload = {
            body: {
                email: 'mail@mail.com'
            }
        }

        let response
        try {
            response = await authenticateUserController.execute(payload)
        } catch (error) {}

        expect(response?.statusCode).toBe(400)
    })

    it('should return 400 if credentials are invalid', async () => {
        const { createUser, authenticateUserController, hash } = makeSut()

        jest.spyOn(hash, 'compare').mockReturnValueOnce(Promise.resolve(false))

        await createUser.execute('John Doe', 'john.doe@mail.com',
            'validpassword', '99999999999', new Date(), 'bio')

        const payload = {
            body: {
                email: 'john.doe@mail.com',
                password: 'invalidpassword'
            }
        }

        let response
        try {
            response = await authenticateUserController.execute(payload)
        } catch (error) {}

        expect(response?.statusCode).toBe(400)
    })

    it('should return 200 if credentials are valid', async () => {
        const { createUser, authenticateUserController, hash } = makeSut()

        await createUser.execute('John Doe', 'john.doe@mail.com',
            'validpassword', '99999999999', new Date(), 'bio')

        const payload = {
            body: {
                email: 'john.doe@mail.com',
                password: 'invalidpassword'
            }
        }

        let response
        try {
            response = await authenticateUserController.execute(payload)
        } catch (error) {}

        expect(response?.statusCode).toBe(200)
    })
})
