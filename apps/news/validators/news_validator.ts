import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.unique({
        column: 'title', table: 'news'
      })
    ]),
    priority: schema.number(),
    content: schema.string(),
    start_date: schema.string(),
    end_date: schema.string()
  })

  public messages: CustomMessages = {}
}

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({ trim: true }, [
      rules.unique({
        column: 'title', table: 'news'
      })
    ]),
    priority: schema.number.optional(),
    content: schema.string.optional(),
    start_date: schema.string.optional(),
    end_date: schema.string.optional()
  })

  public messages: CustomMessages = {}
}
