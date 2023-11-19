import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
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
	public paidBy: string

	@column()
	public userId: string

	@belongsTo(() => User, {
		localKey: 'user_id',
	})
	public user: BelongsTo<typeof User>

	@belongsTo(() => User, {
		localKey: 'paid_by',
	})
	public paidByUser: BelongsTo<typeof User>

	@belongsTo(() => Project)
	public project: BelongsTo<typeof Project>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: Transaction) {
		model.id = randomUUID()
	}
}
