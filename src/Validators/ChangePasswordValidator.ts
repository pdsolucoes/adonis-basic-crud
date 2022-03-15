import { schema} from '@ioc:Adonis/Core/Validator'

class ChangePasswordValidator {
    public create() {
        const createSchema = schema.create({
            password: schema.string({trim: true}),
            new_password: schema.string({trim:true}),
            new_password_confirmation:  schema.string({trim: true})
        })
        return createSchema
    }
}

export default new ChangePasswordValidator()