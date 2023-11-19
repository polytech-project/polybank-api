import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Role from 'Domains/users/models/role'

export default class Permission extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public identifier: string

	@manyToMany(() => Role)
	public roles: ManyToMany<typeof Role>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: Permission) {
		model.id = randomUUID()
	}
}
