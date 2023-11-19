import { type HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true, escape: true }),
    description: schema.string.optional({ trim: true, escape: true }),
    device: schema.string.optional({ trim: true, escape: true }),
  })

  public messages: CustomMessages = {}
}


export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({ trim: true, escape: true }),
    description: schema.string.optional({ trim: true, escape: true }),
    users: schema.array.optional().members(
      schema.string({ trim: true, escape: true }, [
        rules.exists({ table: 'users', column: 'id' })
      ])
    ),
  })

  public messages: CustomMessages = {}
}