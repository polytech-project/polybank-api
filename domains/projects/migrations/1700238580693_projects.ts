import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'projects'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.string('id').primary()
			table.string('title')
			table.string('description')
			table.string('device')
			table.string('owner_id').references('id').inTable('users').onDelete('CASCADE')

			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
