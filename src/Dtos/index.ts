import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request';


interface IContract extends RequestContract {
    user: {
        id: string
    }
}

export default interface NewHttpContract extends HttpContextContract {
    request: IContract
}