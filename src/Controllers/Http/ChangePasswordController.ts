import NewHttpContract from '../../Dtos/index';
import GenericExceptionHandler, { StatusCode } from '../../Exceptions/Generic';
import User from '../../models/User'
import BCryptHashProvider from '../../Providers/hashProvider';
import ChangePasswordValidator from '../../Validators/ChangePasswordValidator';

export default class ChangePasswordController {
    public async create({request, response}: NewHttpContract) {
        const  {password, new_password, new_password_confirmation} = await request.validate({
            schema: ChangePasswordValidator.create()
        })
        
        const user =await User.findBy('id', +request.user.id);
        if(!user) {
            throw new GenericExceptionHandler('User does not exists',StatusCode.Forbidden )
        }

        const bCryptHashProvider = new BCryptHashProvider()

        const matchActualPassword = await bCryptHashProvider.compare(password, user.password)
        if(!matchActualPassword) {
            throw new GenericExceptionHandler('Password does not match',StatusCode.BadRequest )
        }

        if(new_password !== new_password_confirmation) {
            throw new GenericExceptionHandler('Password does not match',StatusCode.BadRequest )
        }

        const new_hashed_password =  await bCryptHashProvider.generate(new_password)


        user.password = new_hashed_password;
        await user.save()
        

        return response.ok(user);
    }


}