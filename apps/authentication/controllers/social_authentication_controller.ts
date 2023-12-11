import { type HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import { GithubDriverContract, GoogleDriverContract } from '@ioc:Adonis/Addons/Ally'
import User from "Domains/users/models/user";
import Logger from "@ioc:Adonis/Core/Logger";

export default class SocialAuthenticationController {
  public async redirect({ ally, params }: HttpContextContract) {
    return ally
      .use(params.driver)
      .redirect()
  }

  public async callback({ ally, auth, response, params, request }: HttpContextContract) {
    const driver = ally.use(params.driver) as GithubDriverContract | GoogleDriverContract

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

    const opaqueTokenContract = await auth.use('api').login(user, {
      expiresIn: '1day',
    })

    response.cookie('token', opaqueTokenContract.token, {
      httpOnly: true,
    })

    Logger.info(request.header('referer')!)

    //response.redirect().toPath(request.header('referer') || 'http://localhost:4200')
    return response.redirect().toPath(request.header('referer') || 'http://localhost:4200')
  }
}
