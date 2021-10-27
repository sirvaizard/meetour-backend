import Token from "../../domain/ports/token";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class AuthenticationMiddleware implements Controller {
    constructor (private readonly token: Token, private readonly APP_SECRET: string) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { authorization } = httpRequest.headers
        if (!authorization) {
            return Promise.resolve({
                statusCode: 401,
                body: {
                    error: 'Token not provided.'
                }
            })
        }

        const userId = await this.token.verify(authorization, this.APP_SECRET)
        if (userId) {
            if (!httpRequest.body)
                httpRequest.body = {}
            httpRequest.body.userId = userId
            return Promise.resolve({
                statusCode: 200,
                body: {}
            })
        } else {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Invalid token.'
                }
            })
        }
    }
}
