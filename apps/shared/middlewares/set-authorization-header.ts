import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetAuthorizationHeader {
	public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		const token = request.cookie('token')

    console.log(token)

		if (token) {
			request.headers().authorization = `Bearer ${token}`
		}

		await next()
	}
}


/**
 * Mathias paye pour NAthael à 50
 * -> Mathias +50
 * -> Nathael -50
 * -> Dorian 0
 *
 *  Dorian paye pour Mathias et Nathael (100€)
 *  -> Mathias 0
 *  -> Dorian 100
 *  -> Nathael -100
 */
