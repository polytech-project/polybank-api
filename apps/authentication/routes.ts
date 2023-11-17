import Route from '@ioc:Adonis/Core/Route'

export default () => {
  Route.group(() => {
    Route.get('/:driver/redirect', 'authentication_controller.redirect').as('auth.redirect')

    Route.get('/:driver/callback', 'authentication_controller.callback').as('auth.callback')

    Route.group(() => {
      Route.get('/me', 'authentication_controller.me').as('auth.me')
    }).middleware('auth')
  }).namespace('App/authentication/controllers')
}