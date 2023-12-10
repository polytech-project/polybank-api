import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'email' })
    ]),
    username: schema.string({ trim: true }),
    password: schema.string({ trim: true })
  })

  public messages: CustomMessages = {}
}
