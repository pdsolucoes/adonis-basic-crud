import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import {randomUUID} from 'crypto'

import ForgotPasswordValidator from '../../Validators/ForgotPasswordValidator'
import User from '../../models/User'
import tokensRepository from '../../repositories/tokensRepository'
import MailTemplateProvider from '../../Providers/mailTemplateProvider'

class ForgotPasswordController {
    public async create({request, response}: HttpContextContract) {
        const {email} = await request.validate({
            schema: ForgotPasswordValidator.create()
        })

        const user = await User.findBy('email', email)

        if(!user) {
           return response.ok({message: "If email is registered in 10 min you will get a e-mail."})
        }

        await tokensRepository.deleteAllTokensByUser(user.id)

        const token =  await tokensRepository.createToken({user_id: user.id, token: randomUUID()})

        const url = `${Env.get('APP_WEB_URL')}/forgot/${token.token}`

        const mailTemplateProvider = new MailTemplateProvider()
        const html =  await mailTemplateProvider.parse({
            filename: 'forgot-password.hbs',
            variables: {
                name: user.name,
                url
            }
        })

        await Mail.sendLater((message) => {
            message
            .from(Env.get('FROM_EMAIL'))
            .to(user.email)
            .subject("Forgot password")
            .html(html)
        })

        return response.ok({message: "If email is registered in 10 min you will get a e-mail."})

    }
}

export default ForgotPasswordController