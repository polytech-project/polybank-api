import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'Domains/users/models/user'
import {RegisterUserValidator} from "App/authentication/validators/authentication_validator";

export default class AuthenticationController {
	public async me({ auth, response }: HttpContextContract) {
		const user = auth.user as User
    await user.load('roles', (query) => query.preload('permissions'))

		return response.send(user)
	}

	public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)

      response.cookie('token', token.token, {
        httpOnly: true,
        secure: true
      })
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(RegisterUserValidator)

    const user = await User.create({
      password: data.password,
      email: data.email,
      isVerified: true,
      username: data.username,
    })

    const token = await auth.use('api').login(user)

    response.cookie('token', token.token, {
      httpOnly: true,
      secure: true
    })

    return response.send({
      user: user,
      token: token.token
    })
  }
}
