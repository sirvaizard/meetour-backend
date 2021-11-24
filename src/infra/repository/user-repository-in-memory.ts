import UserRepository from "../../domain/repository/user-repository";
import User from "../../domain/entity/user";

export default class UserRepositoryInMemory implements UserRepository {
    readonly users: User[]

    constructor () {
        this.users = []
    }

    create(name: string, email: string, password: string, cpf: string, birth: Date, bio: string): Promise<User> {
        const user = new User(
            String(this.users.length), cpf, password, name, birth, email, bio
        )
        this.users.push(user)
        return Promise.resolve(user)
    }

    findById (id: string): Promise<User | null | undefined> {
        return Promise.resolve(this.users.find((user) => user.id === id))
    }

    findByCpf(cpf: string): Promise<User | null> {
        const user = this.users.find((user) => user.cpf === cpf)
        return Promise.resolve(user ? user : null)
    }

    findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((user) => user.email === email)
        return Promise.resolve(user ? user : null)
    }
}
