import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import AuthenticateUser from "../../../src/domain/usecase/authenticate-user"
import CreateUser from "../../../src/domain/usecase/create-user"
import Hash from "../../../src/domain/ports/hash"
import Token from "../../../src/domain/ports/token"

const makeToken = (): Token => {
    class TokenStub implements Token {
        generate (payload: any, secret: string): string {
            return 'tokentokentoken'
        }
    }

    return new TokenStub()
}

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
    createUser: CreateUser,
    authenticateUser: AuthenticateUser
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const token = makeToken()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const authenticateUser = new AuthenticateUser(userRepository, hash, token, 'secret')

    return {
        createUser,
        authenticateUser
    }
}

describe('#Authenticate User', () => {
    it('should athenticate user with valid credentials', async () => {
        const { createUser, authenticateUser } = makeSut()

        await createUser.execute('John Doe', 'john.doe@mail.com',
            'correctpassword', '99999999999', new Date())

        const response = await authenticateUser.execute('john.doe@mail.com', 'correctpassword')

        expect(response).toEqual('tokentokentoken')
    })
})
