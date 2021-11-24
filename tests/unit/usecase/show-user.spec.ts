import Hash from "../../../src/domain/ports/hash"
import CreateUser from "../../../src/domain/usecase/create-user"
import ShowUser from "../../../src/domain/usecase/show-user"
import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"

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
    showUser: ShowUser
}

const makeSut = (): SutType => {
    const hash = makeHash()
    const userRepository = new UserRepositoryInMemory()
    const createUser = new CreateUser(userRepository, hash)
    const showUser = new ShowUser(userRepository)

    return {
        createUser,
        showUser
    }
}


describe('#Show User', () => {
    it('should return null if user does not exists', async () => {
        const { showUser } = makeSut()

        const user = await showUser.execute('id_invalido')

        expect(user).toBe(null)
    })

    it('should return user if a valid id is passed', async () => {
        const { createUser, showUser } = makeSut()

        const newUser = await createUser.execute('John Doe', 'john.doe@mail.com',
            'dasdas', '77777777777', new Date(), 'bio')

        const user = await showUser.execute(newUser.id)

        expect(user?.id).toBe(newUser.id)
    })
})
