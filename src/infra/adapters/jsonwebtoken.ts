import jwt from 'jsonwebtoken'

import Token from "../../domain/ports/token";

export default class JsonWebToken implements Token {
    generate (payload: any, secret: string): string {
        return jwt.sign(payload, secret)
    }
}
