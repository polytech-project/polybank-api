import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm"
import { DateTime } from "luxon"
import { randomUUID } from "node:crypto" 

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Project) {
    model.id = randomUUID()
  }
}