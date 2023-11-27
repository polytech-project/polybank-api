import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetAuthorizationHeader {
	public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		const token = request.cookie('token')
		
		if (token) {
			request.headers().authorization = `Bearer ${token}`
		}

		await next()
	}
}
