import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {inject} from '@adonisjs/fold'
import TransactionService from '../services/transaction_service'
import ProjectService from "App/projects/services/project_service";
import {CreateTransactionValidator} from "App/projects/validators/transaction_validator";

@inject()
export default class TransactionsController {
  public transactionService = TransactionService
  public projectService = ProjectService


  public async index({ request, params, response, bouncer }: HttpContextContract) {
    const { page = 1, size = 10 } = request.qs()
    const { project } = await this.projectService.findById(params.projectId)

    await bouncer.with('ProjectPolicy').authorize('view', project)

    const transactions = await this.transactionService.findByProjectId(project.id, page, size)

    return response.send(transactions)
  }

  public async show ({ params, response, bouncer }: HttpContextContract) {
    const transaction = await this.transactionService.findById(params.id)

    await bouncer.with('TransactionPolicy').authorize('view', transaction)

    return response.send(transaction)
  }

  public async store ({ request, bouncer, params, auth, response }: HttpContextContract) {
    const data = await request.validate(CreateTransactionValidator)

    if (!data.users.length) {
      return response.badRequest('no users give')
    }
    
    const { project } = await this.projectService.findById(params.projectId)

    await bouncer.with('ProjectPolicy').authorize('view', project)

    const transaction = await this.transactionService.createTransaction({
      ...data,
      project_id: project.id,
      user_id: auth.user!.id
    })

    return response.send(transaction)
  }

  public async update ({ }: HttpContextContract) {}

  public async destroy ({ }: HttpContextContract) {}
}
