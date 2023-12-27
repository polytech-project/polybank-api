import {
	BaseModel,
	BelongsTo,
	HasMany,
	ManyToMany,
	beforeCreate,
	belongsTo,
	column,
	hasMany,
	manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'Domains/users/models/user'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Transaction from './transaction'
import {computed} from "@adonisjs/lucid/build/src/Orm/Decorators";
import Logger from "@ioc:Adonis/Core/Logger";

export default class Project extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public title: string

	@column()
	public description: string

	@column()
	public device: string

	@column()
	public ownerId: string

  @column()
  public archived: boolean

  @column()
  public type: string

  @computed()
  public get expense(): number {
    try {
      return this.transactions.filter((t) => t.type = 'expense')
        .reduce((acc, curr) => acc += curr.amount, 0)
    } catch (e) {
      Logger.error(e)
      return 0
    }

  }

  @computed()
  public get refunds() {
    try {
      return this.users.map((user) => {
        let amount = 0
        this.transactions.forEach((transaction) => {
          const userIds = transaction.users.map(u => u.id)

          if (transaction.paidBy === user.id) {
            amount += transaction.amount
          }

          if (userIds.includes(user.id)) {
            amount -= transaction.amount / transaction.users.length
          }
        })

        return {
          id: user.id,
          username: user.username,
          amount: amount
        }
      })
    } catch (e) {
      Logger.error(e)
      return []
    }

  }

	@belongsTo(() => User, { localKey: 'owner_id' })
	public owner: BelongsTo<typeof User>

	@manyToMany(() => User)
	public users: ManyToMany<typeof User>

	@hasMany(() => Transaction)
	public transactions: HasMany<typeof Transaction>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: Project) {
		model.id = randomUUID()
	}
}
