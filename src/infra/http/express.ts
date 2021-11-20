import Controller from "../../presentation/protocols/controller"

export class ExpressControllerAdapter {
    static create (controller: Controller) {
        const handler = controller.execute.bind(controller)
        return async function (req: any, res: any) {
            const { body, statusCode} = await handler({body: req.body, params: req.params, headers: req.headers, query: req.query })
            return res.status(statusCode).json(body)
        }
    }
}

export class ExpressMiddlewareAdapter {
    static create (middleware: Controller) {
        const handler = middleware.execute.bind(middleware)
        return async function (req: any, res: any, next: any) {
            const { body, statusCode} = await handler({body: req.body, params: req.params, headers: req.headers})

            // Adopting a pattern that all successfull middleware will return code 200
            if (statusCode !== 200) {
                return res.status(statusCode).json(body)
            }

            return next()
        }
    }
}
