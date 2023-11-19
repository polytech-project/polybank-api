import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'transactions'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.string('id').primary()
			table.string('title')
			table.float('amount')
			table.string('project_id').references('id').inTable('projects').onDelete('CASCADE')
			table.string('paid_by').references('id').inTable('users').onDelete('CASCADE')
			table.string('user_id').references('id').inTable('users').onDelete('CASCADE')

			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
