import UserRepositoryInMemory from "../../../src/infra/repository/user-repository-in-memory"
import UserRepository from "../../../src/domain/repository/user-repository"
import CreateUser from "../../../src/domain/usecase/create-user"

describe('#User', () => {
    it('should be able to create an user with valid params', async () => {
        const userRepository: UserRepository = new UserRepositoryInMemory()
        const createUser = new CreateUser(userRepository)
        const now = new Date()

        const user = await createUser.execute('John Doe', 'john.doe@mail.com',
            'correctpassword', '99999999999', now)

        expect(user).toEqual({
            id: '0',
            name: 'John Doe',
            email: 'john.doe@mail.com',
            password: 'correctpassword',
            birth: now,
            cpf: '99999999999'
        })
    })
})
