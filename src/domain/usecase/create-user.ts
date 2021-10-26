import UserRepository from "../repository/user-repository";
import Hash from "../ports/hash";

export default class CreateUser {
    constructor (private userRepository: UserRepository, private hash: Hash) {}

    async execute (name: string, email: string, password: string, cpf: string, birth: Date) {
        // TODO: should check for fields validity

        const password_hash = await this.hash.hash(password)
        return await this.userRepository.create(name, email, password_hash, cpf, birth)
    }
}
