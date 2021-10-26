import UserRepository from "../../domain/repository/user-repository";
import User from "../../domain/entity/user";

export default class UserRepositoryInMemory implements UserRepository {
    readonly users: User[]

    constructor () {
        this.users = []
    }

    create(name: string, email: string, password: string, cpf: string, birth: Date): Promise<User> {
        const user = new User(
            String(this.users.length), cpf, password, name, birth, email
        )
        this.users.push(user)
        return Promise.resolve(user)
    }

    findById(): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByCpf(): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByEmail(): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}
