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
