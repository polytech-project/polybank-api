import { DateTime } from 'luxon'
import { column, BaseModel, beforeCreate, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { randomUUID } from 'node:crypto'
import Role from './role'
import Project from 'Domains/projects/models/project'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public username: string

	@column()
	public email: string

	@column()
	public rememberMeToken: string | null

	@column()
	public accessToken: string | null

	@column()
	public avatarUrl: string | null

	@column()
	public isVerified: boolean

	@manyToMany(() => Role)
	public roles: ManyToMany<typeof Role>

	@manyToMany(() => Project)
	public projects: ManyToMany<typeof Project>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: User) {
		model.id = randomUUID()
	}
}
