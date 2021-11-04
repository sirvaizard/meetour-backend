import { sql } from '@databases/pg'
import UserRepository from '../../domain/repository/user-repository'
import User from '../../domain/entity/user'
import db from './connections/postgresql-connection'

type UserDTO = {
    id: string
    cpf: string
    nome: string
    email: string
    senha: string
    data_nascimento: Date
}

export default class UserRepositoryPostgreSQL implements UserRepository {
    async create(name: string, email: string, password: string, cpf: string, birth: Date): Promise<User> {

        await db.query(sql`
                INSERT INTO usuario (nome, email, senha, cpf, data_nascimento)
                VALUES (${name}, ${email}, ${password}, ${cpf}, ${birth})
            `)

        const userDTO: UserDTO[] = await db.query(sql`
            SELECT * FROM usuario
            WHERE email = ${email}
        `)

        const user = new User(
            userDTO[0].id,
            userDTO[0].cpf,
            userDTO[0].senha,
            userDTO[0].nome,
            userDTO[0].data_nascimento,
            userDTO[0].email
        )

        return Promise.resolve(user)
    }
    findById(id: string): Promise<User | null | undefined> {
        throw new Error('Method not implemented.')
    }
    async findByCpf(cpf: string): Promise<User | null | undefined> {
        const userDTO: UserDTO[] = await db.query(sql`
            SELECT * FROM usuario
            WHERE cpf = ${cpf}
        `)

        if (userDTO.length) {
            return Promise.resolve(new User(
                userDTO[0].id,
                userDTO[0].cpf,
                userDTO[0].senha,
                userDTO[0].nome,
                userDTO[0].data_nascimento,
                userDTO[0].email
            ))
        }

        return Promise.resolve(null)
    }
    async findByEmail(email: string): Promise<User | null | undefined> {
        const userDTO: UserDTO[] = await db.query(sql`
            SELECT * FROM usuario
            WHERE email = ${email}
        `)

        if (userDTO.length) {
            return Promise.resolve(new User(
                userDTO[0].id,
                userDTO[0].cpf,
                userDTO[0].senha,
                userDTO[0].nome,
                userDTO[0].data_nascimento,
                userDTO[0].email
            ))
        }

        return Promise.resolve(null)
    }

}
