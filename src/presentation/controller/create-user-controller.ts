import CreateUser from "../../domain/usecase/create-user";
import Controller from "../protocols/controller"
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class CreateUserController implements Controller {
    constructor (private createUser: CreateUser) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['name', 'email', 'password', 'cpf', 'birth', 'bio']

        const missingFields = []
        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                missingFields.push(field)
            }
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
            const { name, email, password, cpf, birth, bio} = httpRequest.body
            const user = await this.createUser.execute(name, email, password, cpf, birth, bio)

            return Promise.resolve({
                statusCode: 201,
                body: user
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
