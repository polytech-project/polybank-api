import UserService from 'App/users/services/user_service'
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {inject} from '@adonisjs/fold'

@inject()
export default class UsersController {
  private userService = UserService

  public async index({ request, bouncer, response, auth }: HttpContextContract) {
    const { admin, search, excludeSelf, page, perPage, sortField, sortOrder } = request.qs()

    if (admin) {
      await bouncer.with('UserPolicy').authorize('view')
    }

    const users = await this.userService.findAll({
      search,  excludeSelf, page, perPage, sortOrder, sortField
    }, auth.user!.id!)

    return response.send(users)
  }
}
