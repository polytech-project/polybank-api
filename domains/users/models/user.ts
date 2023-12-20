import { DateTime } from 'luxon'
import {column, BaseModel, beforeCreate, manyToMany, ManyToMany, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import { randomUUID } from 'node:crypto'
import Role from './role'
import Hash from '@ioc:Adonis/Core/Hash'
import Project from 'Domains/projects/models/project'
import {beforeSave} from "@adonisjs/lucid/build/src/Orm/Decorators";
import Transaction from "Domains/projects/models/transaction";

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
  public password: string

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

  @manyToMany(() => Transaction)
  public transactions: ManyToMany<typeof Transaction>

  @hasMany(() => Transaction, {
    foreignKey: 'paidBy'
  })
  public transactionsPayed: HasMany<typeof Transaction>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async generateUuid(model: User) {
		model.id = randomUUID()
	}

  @beforeSave()
  public static async hashPassword(model: User) {
    if (model.$dirty.password) {
      model.password = await Hash.make(model.password)
    }
  }
}
