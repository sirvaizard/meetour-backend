import UserRepository from "../repository/user-repository";

export default class CreateUser {
    constructor (private userRepository: UserRepository) {}

    async execute (name: string, email: string, password: string, cpf: string, birth: Date) {
        // TODO: should check for fields validity and hash password
        return await this.userRepository.create(name, email, password, cpf, birth)
    }
}
