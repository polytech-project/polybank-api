import { GithubDriverContract, GoogleDriverContract } from '@ioc:Adonis/Addons/Ally'
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'Domains/users/models/user'

export default class AuthenticationController {
	public async me({ auth, response }: HttpContextContract) {
		const user = auth.user

		return response.send(user)
	}

	public async redirect({ ally, params }: HttpContextContract) {
		return ally.use(params.driver).redirect()
	}

	public async callback({ ally, auth, response, params }: HttpContextContract) {
		const driver = ally.use(params.driver) as GithubDriverContract | GoogleDriverContract | GoogleDriverContract

		if (driver.accessDenied()) {
			return 'Access was denied'
		}

		if (driver.stateMisMatch()) {
			return 'Request expired. Retry again'
		}

		if (driver.hasError()) {
			return driver.getError()
		}

		const driverUser = await driver.user()

		if (!driverUser.email) {
			return response.badRequest('Your account must have a verified email address in order to login')
		}

		const user = await User.firstOrCreate(
			{ email: driverUser.email },
			{
				username: driverUser.name,
				accessToken: driverUser.token.token,
				isVerified: driverUser.emailVerificationState === 'verified',
				avatarUrl: driverUser.avatarUrl,
			}
		)

		const opaqueTokenContract = await auth.use('api').login(user)

		response.cookie('token', opaqueTokenContract.token, {
			httpOnly: true,
			secure: true,
		})

		response.redirect().toPath('http://localhost:4200')
	}
}
