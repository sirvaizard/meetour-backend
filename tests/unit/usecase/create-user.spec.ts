import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import UserRepository from "../../../src/domain/repository/user-repository"
import CreateUser from "../../../src/domain/usecase/create-user"
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
    userRepository: UserRepository
    createUser: CreateUser,
    hash: Hash
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)

    return {
        userRepository,
        createUser,
        hash
    }
}

describe('#User', () => {
    it('should be able to create an user with valid params', async () => {
        const { createUser } = makeSut()
        const now = new Date()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com',
            'correctpassword', '99999999999', now)

        expect(user).toEqual({
            id: '0',
            name: 'John Doe',
            email: 'john.doe@mail.com',
            birth: now,
            cpf: '99999999999'
        })
    })

    it('should call Hash with correct password', async () => {
        const { createUser, hash } = makeSut()
        const hashSpy = jest.spyOn(hash, 'hash')

        await createUser.execute('John Doe', 'john.doe@mail.com',
            'correctpassword', '99999999999', new Date())

        expect(hashSpy).toHaveBeenCalledWith('correctpassword')
    })
})
