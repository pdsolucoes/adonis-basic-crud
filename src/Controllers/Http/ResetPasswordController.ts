import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import tokensRepository from '../../repositories/tokensRepository'
import { addHours, isAfter} from "date-fns"
import User from '../../models/User';
import BCryptHashProvider from '../../Providers/hashProvider';
import ResetPasswordValidator from '../../Validators/ResetPasswordValidator';
import GenericExceptionHandler, { StatusCode } from '../../Exceptions/Generic';


class ResetPasswordController {
    public async create({request, response}: HttpContextContract) {
        const {token, new_password, new_password_confirmation} = await request.validate({
            schema: ResetPasswordValidator.create()
        })

       const tokenInDatabase =  await tokensRepository.findBytoken(token);
        if(!tokenInDatabase) {
            throw new GenericExceptionHandler('Invalid token',StatusCode.Forbidden )
        }

       const compareDate = addHours(tokenInDatabase.serialize().created_at, 2)
        if(isAfter(Date.now(), compareDate)) {
            tokensRepository.deleteByToken(tokenInDatabase.token);
            throw new GenericExceptionHandler('Invalid token',StatusCode.Forbidden )
        }

        if(new_password !== new_password_confirmation) {
            throw new GenericExceptionHandler('Password does not match',StatusCode.Forbidden )
        }

        const user =await User.findBy('id', tokenInDatabase.user_id);

        if(!user) {
            throw new GenericExceptionHandler('User does not exists',StatusCode.Forbidden )
        }

        const bcryptHashProvider = new BCryptHashProvider();
        user.password =  await bcryptHashProvider.generate(new_password);

        await user.save()

        tokensRepository.deleteByToken(tokenInDatabase.token);

        return response.noContent()
    }
 }


export default ResetPasswordController