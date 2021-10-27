import jwt from 'jsonwebtoken'

import Token from "../../domain/ports/token";

export default class JsonWebToken implements Token {
    generate (payload: any, secret: string): string {
        return jwt.sign(payload, secret)
    }

    async verify (token: string, secret: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(token, secret).toString()

            return Promise.resolve(decoded)
        } catch {
            return Promise.resolve(null)
        }
    }
}
