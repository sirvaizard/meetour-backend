import AuthenticateUser from "../../domain/usecase/authenticate-user";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class AuthenticateUserController implements Controller {
    constructor (private authenticateUser: AuthenticateUser) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['email', 'password']

        const missingFields = []
        for (const field of requiredFields) {
            if (!httpRequest.body[field])
                missingFields.push(field)
        }

        if (missingFields.length !== 0) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }

        try {
            const { email, password } = httpRequest.body
            const authenticationData = await this.authenticateUser.execute(email, password)

            return Promise.resolve({
                statusCode: 200,
                body: authenticationData
            })
        } catch (error) {
            return Promise.resolve({
                statusCode: 400,
                body: {
                    error: 'Bad request'
                }
            })
        }
    }
}
