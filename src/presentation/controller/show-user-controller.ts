import ShowUser from "../../domain/usecase/show-user";
import Controller from "../protocols/controller";
import HttpRequest from "../protocols/http-request";
import HttpResponse from "../protocols/http-response";

export default class ShowUserController implements Controller {
    constructor (private readonly showUser: ShowUser) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body.id) {
            return Promise.resolve({
                statusCode: 400,
                body: {}
            })
        }

        const user = await this.showUser.execute(httpRequest.body.id)

        if (user) {
            return Promise.resolve({
                statusCode: 200,
                body: user
            })
        }

        return Promise.resolve({
            statusCode: 404,
            body: user
        })
    }

}
