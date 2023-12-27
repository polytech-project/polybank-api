import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import {randomUUID} from "node:crypto";
import User from "Domains/users/models/user";

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public picture: string

  @column()
  public priority: number

  @column()
  public startDate: DateTime

  @column()
  public endDate: DateTime

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: News) {
    model.id = randomUUID()
  }
}
