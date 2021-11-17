import jwt from 'jsonwebtoken'

import Token from "../../domain/ports/token";

export default class JsonWebToken implements Token {
    generate (payload: any, secret: string): string {
        return jwt.sign(payload, secret)
    }

    async verify (token: string, secret: string): Promise<string | null> {
        const [prefix, rawToken] = token.split(' ')

        try {
            const decoded = jwt.verify(rawToken, secret) as any
            return Promise.resolve(decoded.id)
        } catch {
            return Promise.resolve(null)
        }
    }
}
