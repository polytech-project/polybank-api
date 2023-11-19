import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from "@ioc:Adonis/Lucid/Orm"
import User from "Domains/users/models/user"
import { DateTime } from "luxon"
import { randomUUID } from "node:crypto"
import Transaction from "./transaction"

export default class Reimbursement extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public transactionId: string

  @column()
  public amount: number

  @column()
  public status: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Transaction)
  public transaction: BelongsTo<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Reimbursement) {
    model.id = randomUUID()
  }
}