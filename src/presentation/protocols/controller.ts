import HttpRequest from "./http-request";
import HttpResponse from "./http-response";

export default interface Controller {
    execute (HttpRequest: HttpRequest): Promise<HttpResponse>
}
