import { schema,rules } from '@ioc:Adonis/Core/Validator'

class SessionValidator {
    public create() {
        const createSchema = schema.create({
               email: schema.string({trim: true},[rules.email()]),
               password:  schema.string({trim: true},  [rules.minLength(6)])
           })
        return createSchema
    }
}


export default new SessionValidator()