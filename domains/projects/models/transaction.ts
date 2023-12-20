import {BaseModel, BelongsTo, beforeCreate, belongsTo, column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Project from 'Domains/projects/models/project'
import User from 'Domains/users/models/user'

export default class Transaction extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public title: string

	@column()
	public amount: number

	@column()
	public projectId: string

  @column()
  public type: string

	@column()
	public paidBy: string

	@column()
	public userId: string

	@belongsTo(() => User, {
		localKey: 'id',
	})
	public user: BelongsTo<typeof User>

	@belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'paidBy'
  })
	public paidByUser: BelongsTo<typeof User>

	@belongsTo(() => Project)
	public project: BelongsTo<typeof Project>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: Transaction) {
		model.id = randomUUID()
	}
}
