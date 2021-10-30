import User from "../entity/user";

export default interface UserRepository {
    create (name: string, email: string, password: string, cpf: string, birth: Date): Promise<User>
    findById (id: string): Promise<User | null | undefined>
    findByCpf (cpf: string): Promise<User | null | undefined >
    findByEmail (email: string): Promise<User | null | undefined>
}
