import Token from "../../../src/domain/ports/token"
import AuthenticationMiddleware from "../../../src/presentation/controller/authentication-middleware"

const makeToken = (): Token => {
    class TokenStub implements Token {
        generate (payload: any, secret: string): string {
            return 'tokentokentoken'
        }

        async verify (token: string, secret: string): Promise<string | null> {
            return Promise.resolve('id')
        }
    }

    return new TokenStub()
}

interface SutType {
    token: Token
    authenticationMiddleware: AuthenticationMiddleware
}

const makeSut = (): SutType => {
    const token = makeToken()
    const authenticationMiddleware = new AuthenticationMiddleware(token, 'secret')

    return {
        token,
        authenticationMiddleware
    }
}

describe('#Authentication Middleware', () => {
    it('should return 401 if no token is provided', async () => {
        const { authenticationMiddleware } = makeSut()

        const payload = {
            headers: {}
        }

        const response = await authenticationMiddleware.execute(payload)

        expect(response.statusCode).toBe(401)
    })

    it('should return 400 if an invalid token is provided', async () => {
        const { token, authenticationMiddleware } = makeSut()

        jest.spyOn(token, 'verify').mockReturnValueOnce(Promise.resolve(null))

        const payload = {
            headers: {
                authorization: 'invalid token'
            }
        }

        const response = await authenticationMiddleware.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('it should return 200 if a valid token is provided', async () => {
        const { authenticationMiddleware } = makeSut()

        const payload = {
            body: {},
            headers: {
                authorization: 'valid token'
            }
        }

        const response = await authenticationMiddleware.execute(payload)

        expect(response.statusCode).toBe(200)
        expect(payload.body).toHaveProperty('userId')
    })
})
