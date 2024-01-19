import Route from '@ioc:Adonis/Core/Route'
import axios from 'axios'
export default () => {
	Route.group(() => {
		Route.get('/:driver/redirect', 'social_authentication_controller.redirect').as('auth.redirect')

		Route.get('/:driver/callback', 'social_authentication_controller.callback').as('auth.callback')

    Route.post('/login', 'authentication_controller.login').as('authentication.login')
    Route.post('/register', 'authentication_controller.register').as('authentication.register')

		Route.group(() => {
			Route.get('/me', 'authentication_controller.me').as('auth.me')
		}).middleware(['auth', 'throttle:global'])

		Route.get('/hack', async ({ response }) => {
			let counter = 0
			while (counter < 100) {
				const response = await axios.get('http://10.112.0.142:8080/depense/affiliations/1', {
					headers: {
						'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo2LCJpYXQiOjE3MDU0MjMwNzMsImV4cCI6MTcwNTQyNjY3M30.8CHPk3LSeBMMaDLsGkV5F_wKjc9eZ3vU_4RZ3m29VGs`
					}
				})

				console.log(response.data);
			}

			return response.send('hacked')
		}).as('kube')
	}).namespace('App/authentication/controllers')
}
