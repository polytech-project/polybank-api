import Route from '@ioc:Adonis/Core/Route'
export default () => {
  Route.group(() => {
    Route.get('/health', 'health_controller.check').as('security.health-check')
  })
    .namespace('App/security/controllers')
}
