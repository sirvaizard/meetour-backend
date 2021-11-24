import UserRepository from "../repository/user-repository";
import Token from "../ports/token";
import Hash from "../ports/hash";

export default class AuthenticateUser {
    private APP_SECRET: string

    constructor (private userRepository: UserRepository, private hash: Hash, private token: Token, APP_SECRET: string) {
        this.APP_SECRET = APP_SECRET
    }

    async execute (email: string, password: string): Promise<{ token: string; id: string }> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            // TODO: Handle this error better
            throw new Error()
        }

        if(!(await this.hash.compare(password, user.passwordHash))) {
            // TODO: handle this error better
            throw new Error()
        }

        if (!this.APP_SECRET) {
            // TODO: handle this error better
            throw new Error()
        }

        const { id } = user

        const token = this.token.generate({ id }, this.APP_SECRET)

        return {
            token,
            id
        }
    }
}
