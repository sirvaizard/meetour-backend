import { sql } from '@databases/pg'
import UserRepository from '../../domain/repository/user-repository'
import User from '../../domain/entity/user'
import db from './connections/postgresql-connection'

export default class UserRepositoryPostgreSQL implements UserRepository {
    async create(name: string, email: string, password: string, cpf: string, birth: Date): Promise<User> {

        let userDTO: any = await db.query(sql`
                INSERT INTO usuario (nome, email, senha, cpf, data_nascimento)
                VALUES (${name}, ${email}, ${password}, ${cpf}, ${birth})
            `)

        const user = new User(
            userDTO.id,
            userDTO.cpf,
            userDTO.senha,
            userDTO.nome,
            userDTO.data_nascimento,
            userDTO.email
        )

        return Promise.resolve(user)
    }
    findById(id: string): Promise<User | null | undefined> {
        throw new Error('Method not implemented.')
    }
    async findByCpf(cpf: string): Promise<User | null | undefined> {
        const userDTO: any = await db.query(sql`
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
        const userDTO: any = await db.query(sql`
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
