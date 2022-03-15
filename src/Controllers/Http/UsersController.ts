import NewHttpContract from '../../Dtos/index';

import UserValidator from '../../Validators/UserValidator'
import User from '../../models/User'
import BCryptHashProvider from '../../Providers/hashProvider'
import GenericExceptionHandler, { StausCode } from '../../Exceptions/Generic'

export default class UsersController {

  public async create({request, response}: NewHttpContract) {
    const hashProvider = new BCryptHashProvider()
   
   const {email, name, password} =  await request.validate({schema: UserValidator.create() })
    const userWithSameEmail = await User.query().where('email', '=', email)

    if(userWithSameEmail.length !== 0) {
      throw new GenericExceptionHandler('Email already in use!',StausCode.Forbidden )
    }

    const hashed_password =  await hashProvider.generate(password);
    const user = await User.create({email, password: hashed_password , name})

    return response.ok(user)
  }

  public async read({request, response}: NewHttpContract) {
    const user =  await User.findOrFail(+request.user.id)

    return response.ok(user)
  }

  public async update({request, response}: NewHttpContract) {
    const {...userData}=await request.validate({schema: UserValidator.update() })
    const user_id =  +request.user.id
    
    const userWithSameEmail =  await User.query()
      .where('email', '=', userData.email)
      .andWhere('id', '!=', user_id)

    if(userWithSameEmail.length !== 0) {
      throw new GenericExceptionHandler('Email already in use!',StausCode.Forbidden )
    }

    const user = await User.findOrFail(user_id)

    user.merge(userData);
    
    return response.ok(await user.save())
  }

  public async delete({request, response}: NewHttpContract) {
    const user = await User.findOrFail(+request.user.id)

    await user.delete()

    response.noContent()
  }
}
