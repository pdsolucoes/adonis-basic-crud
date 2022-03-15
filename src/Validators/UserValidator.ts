import { schema,rules } from '@ioc:Adonis/Core/Validator'

class UserValidator {
    public create() {
        const createSchema = schema.create({
               name: schema.string({trim: true}),
               email: schema.string({trim: true},[rules.email()]),
               password:  schema.string({trim: true},  [rules.minLength(6)])
           })
        return createSchema
    }
    public update() {
        const updateSchema = schema.create({
               name: schema.string({trim: true}),
               email: schema.string({trim: true},[rules.email()])
           })
        
        return updateSchema
    }

}

export default new UserValidator();