import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from '../../Validators/SessionValidator'
import User from "../../models/User"

import JWTProvider from "../../Providers/jwtProvider"
import BCryptHashProvider from '../../Providers/hashProvider'
import GenericExceptionHandler, { StatusCode } from '../../Exceptions/Generic'
export default class SessionController {
    public async create({request, response}: HttpContextContract) {
        const {email, password} = await request.validate({schema: SessionValidator.create()})
        const jwtProvider = new JWTProvider()
        const hashProvider = new BCryptHashProvider()
        const user = await User.findBy('email', email)
        if(!user) {
            throw new GenericExceptionHandler('Invalid Email/password!',StatusCode.Forbidden )
        }        
        const matchPassword = await hashProvider.compare(password, user.password)
        
        if(!matchPassword) {
            throw new GenericExceptionHandler('Invalid Email/password!',StatusCode.Forbidden )
        }

        const token = jwtProvider.generateToken(user.id.toString());
    
        return response.ok({
            user,
            token
        })
    }  


}