import Controller from "../../presentation/protocols/controller"

export class ExpressControllerAdapter {
    static create (controller: Controller) {
        const handler = controller.execute.bind(controller)
        return async function (req: any, res: any) {
            const { body, statusCode} = await handler({body: req.body, params: req.params, headers: req.headers})
            return res.status(statusCode).json(body)
        }
    }
}
