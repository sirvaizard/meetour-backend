import User from "../entity/user";
import UserRepository from "../repository/user-repository";

export default class ShowUser {
    constructor (private readonly userRepository: UserRepository) {}

    async execute (id: string): Promise<User | null> {
        const user = await this.userRepository.findById(id)

        if (user) {
            return Promise.resolve(user)
        }

        return Promise.resolve(null)
    }
}
