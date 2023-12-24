import Route from '@ioc:Adonis/Core/Route'

export default () => {
	Route.group(() => {
		Route.get('/:driver/redirect', 'social_authentication_controller.redirect').as('auth.redirect')

		Route.get('/:driver/callback', 'social_authentication_controller.callback').as('auth.callback')

    Route.post('/login', 'authentication_controller.login').as('authentication.login')
    Route.post('/register', 'authentication_controller.register').as('authentication.register')

		Route.group(() => {
			Route.get('/me', 'authentication_controller.me').as('auth.me')
		}).middleware(['auth', 'throttle:global'])
	}).namespace('App/authentication/controllers')
}
