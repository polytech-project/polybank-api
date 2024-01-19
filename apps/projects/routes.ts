import Route from '@ioc:Adonis/Core/Route'

export default () => {
	Route.group(() => {
		Route.group(() => {
			Route.group(() => {
				Route.get('/', 'projects_controller.index').as('projects.index')
				Route.get('/:id', 'projects_controller.show').as('projects.show')
        Route.get('/:id/stats', 'projects_controller.stats').as('projects.stats')
				Route.get('/:id/refunds', 'refunds_controller.show').as('projects.refunds')

				Route.post('/', 'projects_controller.store').as('projects.store')
				Route.put('/:id', 'projects_controller.update').as('projects.update')
				Route.delete('/:id', 'projects_controller.destroy').as('projects.destroy')
			})

			Route.group(() => {
				Route.get('/', 'transactions_controller.index').as('transactions.index')
        Route.get('/:id', 'transactions_controller.show').as('transactions.show')
        Route.post('/', 'transactions_controller.store').as('transactions.store')
			}).prefix('/:projectId/transactions')

		}).middleware(['auth', 'throttle:global'])
	}).namespace('App/projects/controllers')
}
