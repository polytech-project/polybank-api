import { inject } from '@adonisjs/core/build/standalone'
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectService from '../services/project_service'
import RefundService from '../services/refund_service'

@inject()
export default class RefundsController {
  private projectService = ProjectService
  private refundService = RefundService

  public async show({ params, response }: HttpContextContract) {
    const { project } = await this.projectService.findById(params.id)

    const refunds = await this.refundService.getRefundByProject(project)

    return response.send(refunds)
  }
}