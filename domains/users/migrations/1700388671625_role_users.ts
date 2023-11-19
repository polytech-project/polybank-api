import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('role_id')
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
      table.string('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.unique(['role_id', 'user_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
