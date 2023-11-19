import { type HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true, escape: true }),
    description: schema.string.optional({ trim: true, escape: true }),
    device: schema.string.optional({ trim: true, escape: true }),
  })

  public messages: CustomMessages = {}
}