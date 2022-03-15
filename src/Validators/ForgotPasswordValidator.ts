import { schema,rules } from '@ioc:Adonis/Core/Validator'

class ForgotPasswordValidator {
    public create() {
        const createSchema = schema.create({
            email: schema.string({trim: true},[rules.email()])
        })
        return createSchema
    }
}

export default new ForgotPasswordValidator()