import bcrypt from 'bcryptjs'

import Hash from "../../domain/ports/hash";

export default class BcryptHash implements Hash {
    async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, 8)
    }
    async compare(text: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(text, hash)
    }
}
