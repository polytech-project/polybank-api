import Route from '@ioc:Adonis/Core/Route'

export default () => {

  Route.group(() => {
    Route.group(() => {
      Route.group(() => {
        Route.get('/', 'projects_controller.index').as('projects.index')
        Route.get('/:id', 'projects_controller.show').as('projects.show')
        
        Route.post('/', 'projects_controller.store').as('projects.store')
        Route.put('/:id', 'projects_controller.update').as('projects.update')
        Route.delete('/:id', 'projects_controller.destroy').as('projects.destroy')
      }).prefix('/projects')
    }).middleware('auth')
  }).namespace('App/projects/controllers')
}