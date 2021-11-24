export default class User {
    readonly id: string
	readonly cpf: string
	readonly #password: string
	readonly name: string
	readonly birth: Date
	readonly email: string
    readonly bio: string

    constructor (id: string, cpf: string, password: string, name: string,
        birth: Date, email: string, bio: string) {
            this.id = id
            this.cpf = cpf
            this.#password = password
            this.name = name
            this.birth = birth
            this.email = email
            this.bio = bio
    }

    get passwordHash (): string {
        return this.#password
    }
}
